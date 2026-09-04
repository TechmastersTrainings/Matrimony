from typing import Any, Dict, List, Optional, Tuple
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from backend.app.models.enums import Denomination, Gender, MaritalStatus, ProfileStatus, UserRole
from backend.app.models.interaction import UserBlock
from backend.app.models.photo import ProfilePhoto
from backend.app.models.profile import Profile
from backend.app.models.user import User


class DiscoveryService:
    @staticmethod
    def search_profiles(
        db: Session,
        current_user: Optional[User] = None,
        search_query: Optional[str] = None,
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
        blocked_user_ids = []
        if current_user:
            blocked_user_ids = [
                b.blocked_id for b in db.query(UserBlock).filter(UserBlock.blocker_id == current_user.id).all()
            ] + [
                b.blocker_id for b in db.query(UserBlock).filter(UserBlock.blocked_id == current_user.id).all()
            ]

        is_admin = current_user is not None and current_user.role in [UserRole.ADMIN, UserRole.SUPER_ADMIN]

        # Regular members see only APPROVED profiles; Admins see ALL profiles (SUBMITTED, UNDER_REVIEW, APPROVED)
        if not is_admin:
            query = db.query(Profile).filter(
                Profile.status == ProfileStatus.APPROVED,
            )
            if current_user:
                query = query.filter(Profile.user_id != current_user.id)
        else:
            query = db.query(Profile)

        if blocked_user_ids and not is_admin:
            query = query.filter(~Profile.user_id.in_(blocked_user_ids))

        # Free text search across name, church, occupation, education, district
        if search_query and search_query.strip():
            sq = f"%{search_query.strip()}%"
            query = query.filter(
                or_(
                    Profile.first_name.ilike(sq),
                    Profile.last_name.ilike(sq),
                    Profile.church_name.ilike(sq),
                    Profile.occupation_title.ilike(sq),
                    Profile.highest_education.ilike(sq),
                    Profile.district.ilike(sq),
                    Profile.city.ilike(sq),
                    Profile.native_place.ilike(sq),
                )
            )

        # Gender Filter:
        # If explicitly filtered by gender (e.g. admin or visitor choosing 'FEMALE' or 'MALE')
        if gender and gender.strip() and gender.upper() not in ["ALL", "BOTH", "ALL_PROFILES"]:
            try:
                query = query.filter(Profile.gender == Gender(gender.upper()))
            except ValueError:
                pass
        elif not is_admin and current_user:
            # Automatic opposite-gender discovery matching for regular members
            my_profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
            if my_profile and my_profile.gender:
                opposite_gender = Gender.FEMALE if my_profile.gender == Gender.MALE else Gender.MALE
                query = query.filter(Profile.gender == opposite_gender)

        if age_min:
            query = query.filter(Profile.age >= age_min)
        if age_max:
            query = query.filter(Profile.age <= age_max)
        if height_min:
            query = query.filter(Profile.height_cm >= height_min)
        if height_max:
            query = query.filter(Profile.height_cm <= height_max)

        if district and district.strip() and district.upper() not in ["ALL", "ALL INDIA"]:
            query = query.filter(Profile.district.ilike(f"%{district.strip()}%"))

        if education and education.strip():
            query = query.filter(Profile.highest_education.ilike(f"%{education.strip()}%"))

        if occupation_type and occupation_type.strip():
            query = query.filter(Profile.employed_in.ilike(f"%{occupation_type.strip()}%"))

        if denominations and len(denominations) > 0:
            denom_enums = []
            for d in denominations:
                if d and d.strip() and d.upper() != "ALL":
                    try:
                        denom_enums.append(Denomination(d.upper()))
                    except ValueError:
                        pass
            if denom_enums:
                query = query.filter(Profile.denomination.in_(denom_enums))

        if marital_statuses and len(marital_statuses) > 0:
            ms_enums = []
            for m in marital_statuses:
                if m and m.strip() and m.upper() != "ALL":
                    try:
                        ms_enums.append(MaritalStatus(m.upper()))
                    except ValueError:
                        pass
            if ms_enums:
                query = query.filter(Profile.marital_status.in_(ms_enums))

        total = query.count()
        # Order by newly approved profiles first
        profiles = query.order_by(Profile.id.desc()).offset(skip).limit(limit).all()

        results = []
        for p in profiles:
            primary_photo = (
                db.query(ProfilePhoto)
                .filter(ProfilePhoto.profile_id == p.id, ProfilePhoto.is_primary == True)
                .first()
            )
            if not primary_photo:
                primary_photo = db.query(ProfilePhoto).filter(ProfilePhoto.profile_id == p.id).first()

            photo_url = primary_photo.r2_url if primary_photo else None

            candidate_user = None
            if is_admin:
                candidate_user = db.query(User).filter(User.id == p.user_id).first()

            results.append(
                {
                    "id": p.id,
                    "user_id": p.user_id,
                    "first_name": p.first_name,
                    "last_name": p.last_name if is_admin else ((p.last_name[0] + ".") if p.last_name else ""),
                    "mobile_number": candidate_user.mobile_number if (is_admin and candidate_user) else None,
                    "email": candidate_user.email if (is_admin and candidate_user) else None,
                    "status": p.status.value if hasattr(p.status, 'value') else str(p.status) if p.status else None,
                    "age": p.age,
                    "height_cm": p.height_cm,
                    "gender": p.gender.value if hasattr(p.gender, 'value') else str(p.gender) if p.gender else None,
                    "marital_status": p.marital_status.value if hasattr(p.marital_status, 'value') else str(p.marital_status) if p.marital_status else None,
                    "denomination": p.denomination.value if hasattr(p.denomination, 'value') else str(p.denomination) if p.denomination else None,
                    "sub_denomination": p.sub_denomination,
                    "church_name": p.church_name,
                    "district": p.district,
                    "state": p.state,
                    "highest_education": p.highest_education,
                    "occupation_title": p.occupation_title,
                    "annual_income_min": p.annual_income_min,
                    "primary_photo": photo_url,
                    "created_at": p.created_at.isoformat() if p.created_at else None,
                }
            )

        return total, results
