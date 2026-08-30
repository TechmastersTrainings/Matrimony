from typing import Any, Dict, List, Optional
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from backend.app.models.enums import Denomination, Gender, MaritalStatus, ProfileStatus
from backend.app.models.interaction import UserBlock
from backend.app.models.photo import ProfilePhoto
from backend.app.models.profile import Profile
from backend.app.models.user import User


class DiscoveryService:
    @staticmethod
    def search_profiles(
        current_user: User,
        db: Session,
        gender: Optional[str] = None,
        age_min: Optional[int] = None,
        age_max: Optional[int] = None,
        height_min: Optional[int] = None,
        height_max: Optional[int] = None,
        denominations: Optional[List[str]] = None,
        marital_statuses: Optional[List[str]] = None,
        district: Optional[str] = None,
        education: Optional[str] = None,
        occupation_type: Optional[str] = None,
        skip: int = 0,
        limit: int = 20,
    ) -> Tuple[int, List[Dict[str, Any]]]:
        # Exclude blocked users & blocker users
        blocked_user_ids = [
            b.blocked_id for b in db.query(UserBlock).filter(UserBlock.blocker_id == current_user.id).all()
        ] + [
            b.blocker_id for b in db.query(UserBlock).filter(UserBlock.blocked_id == current_user.id).all()
        ]

        query = db.query(Profile).filter(
            Profile.user_id != current_user.id,
            Profile.status == ProfileStatus.APPROVED,
            ~Profile.user_id.in_(blocked_user_ids),
        )

        # Opposite gender by default
        my_profile = current_user.profile
        if not gender and my_profile:
            target_gender = Gender.FEMALE if my_profile.gender == Gender.MALE else Gender.MALE
            query = query.filter(Profile.gender == target_gender)
        elif gender:
            try:
                query = query.filter(Profile.gender == Gender(gender.upper()))
            except ValueError:
                pass

        if age_min:
            query = query.filter(Profile.age >= age_min)
        if age_max:
            query = query.filter(Profile.age <= age_max)
        if height_min:
            query = query.filter(Profile.height_cm >= height_min)
        if height_max:
            query = query.filter(Profile.height_cm <= height_max)
        if district:
            query = query.filter(Profile.district.ilike(f"%{district}%"))
        if education:
            query = query.filter(Profile.highest_education.ilike(f"%{education}%"))
        if denominations:
            denom_enums = [Denomination(d.upper()) for d in denominations if d.upper() in Denomination.__members__]
            if denom_enums:
                query = query.filter(Profile.denomination.in_(denom_enums))
        if marital_statuses:
            m_enums = [MaritalStatus(m.upper()) for m in marital_statuses if m.upper() in MaritalStatus.__members__]
            if m_enums:
                query = query.filter(Profile.marital_status.in_(m_enums))

        total = query.count()
        profiles = query.order_by(Profile.id.desc()).offset(skip).limit(limit).all()

        results = []
        for p in profiles:
            photos = (
                db.query(ProfilePhoto)
                .filter(ProfilePhoto.profile_id == p.id)
                .order_by(ProfilePhoto.is_primary.desc(), ProfilePhoto.order_index)
                .all()
            )
            primary_photo = photos[0].r2_url if photos else None

            # Calculate match score against preferences
            match_score = DiscoveryService.calculate_match_score(my_profile, p)

            results.append({
                "id": p.id,
                "user_id": p.user_id,
                "first_name": p.first_name,
                "last_name": p.last_name[:1] + "." if p.last_name else "",  # Privacy initials
                "gender": p.gender.value,
                "age": p.age,
                "dob": str(p.dob) if p.dob else None,
                "height_cm": p.height_cm,
                "marital_status": p.marital_status.value if p.marital_status else "NEVER_MARRIED",
                "denomination": p.denomination.value if p.denomination else "METHODIST",
                "church_name": p.church_name,
                "district": p.district or "Bidar",
                "state": p.state or "Karnataka",
                "highest_education": p.highest_education,
                "occupation_title": p.occupation_title,
                "annual_income_min": p.annual_income_min,
                "bio": p.bio,
                "faith_testimony": p.faith_testimony,
                "primary_photo": primary_photo,
                "photos_count": len(photos),
                "match_score": match_score,
                "created_at": p.created_at,
            })

        return total, results

    @staticmethod
    def calculate_match_score(my_profile: Optional[Profile], candidate: Profile) -> int:
        if not my_profile or not my_profile.partner_preferences:
            return 80  # Baseline compatibility

        score = 60
        prefs = my_profile.partner_preferences

        # Age match
        if prefs.get("age_min") and prefs.get("age_max") and candidate.age:
            if prefs["age_min"] <= candidate.age <= prefs["age_max"]:
                score += 15

        # Denomination match
        if prefs.get("denomination") and candidate.denomination:
            if candidate.denomination.value in prefs["denomination"]:
                score += 15

        # Location / Bidar bonus
        if candidate.district and candidate.district.lower() == "bidar":
            score += 10

        return min(100, score)
