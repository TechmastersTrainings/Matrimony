from datetime import datetime, date
from typing import Any, Dict, Optional, Tuple
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from backend.app.core.logger import logger
from backend.app.models.enums import (
    Denomination,
    Diet,
    FamilyStatus,
    FamilyValues,
    Gender,
    HabitStatus,
    MaritalStatus,
    OccupationType,
    PhysicalStatus,
    ProfileCreatedBy,
    ProfileStatus,
)
from backend.app.models.profile import Profile, ProfileDraft
from backend.app.models.user import User
from backend.app.schemas.profile import ProfileDraftResponse, ProfileRegistrationMeResponse


class RegistrationService:
    @staticmethod
    def get_or_create_draft(user: User, db: Session) -> ProfileDraft:
        draft = db.query(ProfileDraft).filter(ProfileDraft.user_id == user.id).first()
        if not draft:
            initial_data = {
                "first_name": user.profile.first_name if user.profile else "",
                "last_name": user.profile.last_name if user.profile else "",
                "gender": user.profile.gender.value if user.profile else "MALE",
                "email": user.email,
                "mobile_number": user.mobile_number,
            }
            draft = ProfileDraft(user_id=user.id, current_step=1, draft_data=initial_data)
            db.add(draft)
            db.commit()
            db.refresh(draft)
        return draft

    @staticmethod
    def calculate_completion(draft_data: Dict[str, Any]) -> int:
        """Calculates profile completion percentage (15% to 100%)."""
        points = 15  # base from initial registration

        # Step 1: Basic & Physical
        if draft_data.get("dob") or draft_data.get("age"):
            points += 10
        if draft_data.get("marital_status"):
            points += 5
        if draft_data.get("height_cm"):
            points += 5

        # Step 2: Christian Faith & Church
        if draft_data.get("denomination"):
            points += 15
        if draft_data.get("church_name") or draft_data.get("parish_or_pastor"):
            points += 10

        # Step 3: Education & Career
        if draft_data.get("highest_education"):
            points += 10
        if draft_data.get("occupation_type") or draft_data.get("occupation_title"):
            points += 10

        # Step 4: Family Details
        if draft_data.get("father_name") or draft_data.get("mother_name"):
            points += 10

        # Step 5: Lifestyle & Bio
        if draft_data.get("bio") or draft_data.get("faith_testimony"):
            points += 10

        return min(100, points)

    @staticmethod
    def update_draft(
        user: User,
        current_step: int,
        step_data: Dict[str, Any],
        db: Session,
    ) -> Tuple[ProfileDraft, int]:
        draft = RegistrationService.get_or_create_draft(user, db)

        # Merge existing draft data with new incoming fields
        merged_data = dict(draft.draft_data or {})
        merged_data.update(step_data)
        merged_data["last_updated_step"] = current_step

        draft.current_step = current_step
        draft.draft_data = merged_data
        draft.last_saved_at = datetime.utcnow()

        # Update profile completion & synchronized fields
        completion = RegistrationService.calculate_completion(merged_data)
        profile = db.query(Profile).filter(Profile.user_id == user.id).first()
        if profile:
            profile.completion_percentage = completion
            RegistrationService._sync_draft_to_profile(profile, merged_data)

        db.commit()
        db.refresh(draft)
        return draft, completion

    @staticmethod
    def _sync_draft_to_profile(profile: Profile, data: Dict[str, Any]):
        # Safely sync fields if present
        if "first_name" in data and data["first_name"]:
            profile.first_name = str(data["first_name"]).strip()
        if "last_name" in data and data["last_name"]:
            profile.last_name = str(data["last_name"]).strip()
        if "age" in data and data["age"]:
            try:
                profile.age = int(data["age"])
            except ValueError:
                pass
        if "dob" in data and data["dob"]:
            try:
                if isinstance(data["dob"], str):
                    profile.dob = datetime.strptime(data["dob"], "%Y-%m-%d").date()
            except Exception:
                pass
        if "marital_status" in data and data["marital_status"]:
            try:
                profile.marital_status = MaritalStatus(data["marital_status"].upper())
            except ValueError:
                pass
        if "height_cm" in data and data["height_cm"]:
            try:
                profile.height_cm = int(data["height_cm"])
            except ValueError:
                pass
        if "mother_tongue" in data:
            profile.mother_tongue = str(data["mother_tongue"])

        # Faith
        if "denomination" in data and data["denomination"]:
            try:
                profile.denomination = Denomination(data["denomination"].upper())
            except ValueError:
                pass
        if "sub_denomination" in data:
            profile.sub_denomination = str(data["sub_denomination"])
        if "church_name" in data:
            profile.church_name = str(data["church_name"])
        if "parish_or_pastor" in data:
            profile.parish_or_pastor = str(data["parish_or_pastor"])
        if "is_baptized" in data:
            profile.is_baptized = bool(data["is_baptized"])
        if "is_born_again" in data:
            profile.is_born_again = bool(data["is_born_again"])

        # Location
        if "state" in data:
            profile.state = str(data["state"])
        if "district" in data:
            profile.district = str(data["district"])
        if "city" in data:
            profile.city = str(data["city"])
        if "pincode" in data:
            profile.pincode = str(data["pincode"])
        if "native_place" in data:
            profile.native_place = str(data["native_place"])

        # Career
        if "highest_education" in data:
            profile.highest_education = str(data["highest_education"])
        if "occupation_type" in data and data["occupation_type"]:
            try:
                profile.occupation_type = OccupationType(data["occupation_type"].upper())
            except ValueError:
                pass
        if "occupation_title" in data:
            profile.occupation_title = str(data["occupation_title"])
        if "employed_in" in data:
            profile.employed_in = str(data["employed_in"])
        if "annual_income_min" in data and data["annual_income_min"]:
            try:
                profile.annual_income_min = int(data["annual_income_min"])
            except ValueError:
                pass
        if "work_location" in data:
            profile.work_location = str(data["work_location"])

        # Family
        if "father_name" in data:
            profile.father_name = str(data["father_name"])
        if "father_occupation" in data:
            profile.father_occupation = str(data["father_occupation"])
        if "mother_name" in data:
            profile.mother_name = str(data["mother_name"])
        if "mother_occupation" in data:
            profile.mother_occupation = str(data["mother_occupation"])
        if "family_status" in data and data["family_status"]:
            try:
                profile.family_status = FamilyStatus(data["family_status"].upper())
            except ValueError:
                pass
        if "family_values" in data and data["family_values"]:
            try:
                profile.family_values = FamilyValues(data["family_values"].upper())
            except ValueError:
                pass

        # Lifestyle & Bio
        if "diet" in data and data["diet"]:
            try:
                profile.diet = Diet(data["diet"].upper())
            except ValueError:
                pass
        if "bio" in data:
            profile.bio = str(data["bio"])
        if "faith_testimony" in data:
            profile.faith_testimony = str(data["faith_testimony"])

        # Partner Preferences
        if "partner_preferences" in data and isinstance(data["partner_preferences"], dict):
            profile.partner_preferences = data["partner_preferences"]

    @staticmethod
    def submit_profile(user: User, db: Session) -> Profile:
        profile = db.query(Profile).filter(Profile.user_id == user.id).first()
        if not profile:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found.")

        draft = db.query(ProfileDraft).filter(ProfileDraft.user_id == user.id).first()
        if draft and draft.draft_data:
            RegistrationService._sync_draft_to_profile(profile, draft.draft_data)

        # Minimum required fields check for submission
        if not profile.denomination:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Christian denomination is required to submit profile.",
            )

        profile.status = ProfileStatus.SUBMITTED
        profile.submitted_at = datetime.utcnow()
        profile.completion_percentage = max(80, profile.completion_percentage)

        db.commit()
        db.refresh(profile)
        logger.info(f"Profile submitted for User ID {user.id} (Status: SUBMITTED)")
        return profile
