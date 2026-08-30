from datetime import datetime
from typing import Dict, List, Tuple
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from backend.app.core.logger import logger
from backend.app.models.enums import AuditAction, PhotoStatus, ProfileStatus
from backend.app.models.photo import ProfilePhoto
from backend.app.models.profile import Profile
from backend.app.models.user import User
from backend.app.models.verification import AuditLog, ProfileVerification
from backend.app.services.photo_service import PhotoService


class VerificationService:
    @staticmethod
    def run_automated_checks(profile: Profile, db: Session) -> Tuple[bool, Dict[str, bool], List[str]]:
        """Runs automated validation checks on submitted profile."""
        checks = {}
        flags = []

        # 1. Required Information Completeness
        req_fields = [
            ("first_name", profile.first_name),
            ("last_name", profile.last_name),
            ("gender", profile.gender),
            ("denomination", profile.denomination),
            ("dob", profile.dob or profile.age),
            ("state", profile.state),
            ("district", profile.district),
        ]
        missing_fields = [name for name, val in req_fields if not val]
        checks["required_info_complete"] = len(missing_fields) == 0
        if missing_fields:
            flags.append(f"Missing required fields: {', '.join(missing_fields)}")

        # 2. Contact Verification Status
        user = db.query(User).filter(User.id == profile.user_id).first()
        is_verified = user and (user.is_mobile_verified or user.is_email_verified)
        checks["contact_verified"] = bool(is_verified)
        if not is_verified:
            flags.append("User mobile or email has not completed OTP verification.")

        # 3. Minimum 5 Photos Requirement
        has_min_photos, photo_count = PhotoService.check_min_photos(profile.id, db)
        checks["min_5_photos_uploaded"] = has_min_photos
        if not has_min_photos:
            flags.append(f"Minimum 5 photos required (currently uploaded: {photo_count}).")

        # 4. Duplicate Account Detection
        duplicate_candidate = (
            db.query(Profile)
            .filter(
                Profile.id != profile.id,
                Profile.first_name.ilike(profile.first_name),
                Profile.last_name.ilike(profile.last_name),
                Profile.dob == profile.dob,
            )
            .first()
        )
        checks["no_duplicate_detected"] = duplicate_candidate is None
        if duplicate_candidate:
            flags.append(f"Potential duplicate account detected (matched Profile ID #{duplicate_candidate.id}).")

        # 5. Basic Content / Link Scan
        bio_text = f"{profile.bio or ''} {profile.faith_testimony or ''}".lower()
        prohibited_terms = ["http://", "https://", "wa.me", "telegram", "scam", "escort"]
        has_prohibited = any(term in bio_text for term in prohibited_terms)
        checks["content_clean"] = not has_prohibited
        if has_prohibited:
            flags.append("Bio or faith testimony contains external links or flagged keywords.")

        all_passed = all(checks.values())
        return all_passed, checks, flags

    @staticmethod
    def process_profile_submission(profile: Profile, db: Session) -> ProfileVerification:
        """Processes submitted profile through automated pipeline into UNDER_REVIEW."""
        all_passed, checks, flags = VerificationService.run_automated_checks(profile, db)

        # Create verification record
        verification = ProfileVerification(
            profile_id=profile.id,
            automated_checks_passed=all_passed,
            checks_detail=checks,
            flagged_reasons=flags,
        )
        db.add(verification)

        # Transition profile to UNDER_REVIEW
        profile.status = ProfileStatus.UNDER_REVIEW
        profile.submitted_at = datetime.utcnow()

        db.commit()
        db.refresh(verification)
        db.refresh(profile)

        logger.info(f"Profile #{profile.id} processed for verification. Status: UNDER_REVIEW, Passed: {all_passed}")
        return verification

    @staticmethod
    def handle_post_approval_edit(profile: Profile, db: Session):
        """Enforces frozen rule: if approved profile edits critical fields, moves to UNDER_REVIEW."""
        if profile.status == ProfileStatus.APPROVED:
            profile.status = ProfileStatus.UNDER_REVIEW
            logger.info(f"Approved Profile #{profile.id} edited. Status moved to UNDER_REVIEW for moderation.")
            db.commit()
