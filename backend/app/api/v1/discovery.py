from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.app.core.security import get_current_user
from backend.app.models.enums import ProfileStatus, UserRole
from backend.app.models.photo import ProfilePhoto
from backend.app.models.profile import Profile
from backend.app.models.subscription import UserSubscription
from backend.app.models.user import User
from backend.app.services.database import get_db
from backend.app.services.discovery_service import DiscoveryService

router = APIRouter(prefix="/discovery", tags=["Discovery & Matching"])


@router.get(
    "/search",
    summary="Search & Filter Approved Matrimonial Profiles in Bidar & Surrounding",
)
async def search_profiles(
    search_query: Optional[str] = Query(None, alias="q"),
    gender: Optional[str] = None,
    age_min: Optional[int] = Query(None, ge=18, le=80),
    age_max: Optional[int] = Query(None, ge=18, le=80),
    height_min: Optional[int] = Query(None, ge=100, le=250),
    height_max: Optional[int] = Query(None, ge=100, le=250),
    denominations: Optional[List[str]] = Query(None),
    marital_statuses: Optional[List[str]] = Query(None),
    district: Optional[str] = None,
    education: Optional[str] = None,
    occupation_type: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    total, results = DiscoveryService.search_profiles(
        db=db,
        current_user=current_user,
        search_query=search_query,
        gender=gender,
        age_min=age_min,
        age_max=age_max,
        height_min=height_min,
        height_max=height_max,
        denominations=denominations,
        marital_statuses=marital_statuses,
        district=district,
        education=education,
        occupation_type=occupation_type,
        skip=skip,
        limit=limit,
    )

    is_subscriber = False
    if current_user:
        active_sub = db.query(UserSubscription).filter(
            UserSubscription.user_id == current_user.id,
            UserSubscription.status == "ACTIVE"
        ).first()
        is_subscriber = active_sub is not None or current_user.role in [UserRole.ADMIN, UserRole.SUPER_ADMIN]

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "is_subscriber": is_subscriber,
        "profiles": results,
    }


@router.get(
    "/profiles/{profile_id}",
    summary="Get Detailed Candidate Profile with Protected Detail Field Access Control",
)
async def get_candidate_profile(
    profile_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = db.query(Profile).filter(Profile.id == profile_id).first()
    is_admin = current_user is not None and current_user.role in [UserRole.ADMIN, UserRole.SUPER_ADMIN]
    is_owner = current_user is not None and profile and current_user.id == profile.user_id

    if not profile or (profile.status != ProfileStatus.APPROVED and not is_admin and not is_owner):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate profile is not available or is currently under moderation review.",
        )

    photos = db.query(ProfilePhoto).filter(ProfilePhoto.profile_id == profile.id).all()

    # Check subscription status
    is_subscriber = False
    if current_user:
        active_sub = db.query(UserSubscription).filter(
            UserSubscription.user_id == current_user.id,
            UserSubscription.status == "ACTIVE"
        ).first()
        is_subscriber = active_sub is not None or current_user.role in [UserRole.ADMIN, UserRole.SUPER_ADMIN] or current_user.id == profile.user_id

    # If unpaid visitor/user, mask protected detail fields (Church, Package, Location, Profession)
    if not is_subscriber:
        return {
            "id": profile.id,
            "user_id": profile.user_id,
            "first_name": profile.first_name,
            "last_name": profile.last_name[0] + "." if profile.last_name else "",
            "gender": profile.gender.value if profile.gender else None,
            "marital_status": profile.marital_status.value if profile.marital_status else None,
            "age": profile.age,
            "height_cm": profile.height_cm,
            "denomination": profile.denomination.value if profile.denomination else None,
            "highest_education": profile.highest_education,
            # Protected fields hidden for unpaid members
            "church_name": None,
            "parish_or_pastor": None,
            "sub_denomination": None,
            "district": None,
            "state": None,
            "city": None,
            "native_place": None,
            "occupation_title": None,
            "employed_in": None,
            "annual_income_min": None,
            "annual_income_max": None,
            "photos": [
                {
                    "id": p.id,
                    "r2_url": p.r2_url,
                    "is_primary": p.is_primary,
                }
                for p in photos if p.is_primary
            ],
            "is_locked": True,
            "requires_subscription": True,
            "message": "Upgrade to an active subscription plan to unlock full church details, package information, verified location, and express interest.",
        }

    # Full details for paid active subscribers or Admins
    candidate_user = db.query(User).filter(User.id == profile.user_id).first()
    is_admin = current_user is not None and current_user.role in [UserRole.ADMIN, UserRole.SUPER_ADMIN]

    return {
        "id": profile.id,
        "user_id": profile.user_id,
        "first_name": profile.first_name,
        "last_name": profile.last_name if is_admin else (profile.last_name[0] + "." if profile.last_name else ""),
        "mobile_number": candidate_user.mobile_number if (is_admin and candidate_user) else None,
        "email": candidate_user.email if (is_admin and candidate_user) else None,
        "is_admin_override": is_admin,
        "gender": profile.gender.value if profile.gender else None,
        "marital_status": profile.marital_status.value if profile.marital_status else None,
        "age": profile.age,
        "dob": profile.dob.isoformat() if profile.dob else None,
        "height_cm": profile.height_cm,
        "weight_kg": profile.weight_kg,
        "physical_status": profile.physical_status.value if hasattr(profile.physical_status, 'value') else str(profile.physical_status) if profile.physical_status else None,
        "denomination": profile.denomination.value if profile.denomination else None,
        "sub_denomination": profile.sub_denomination,
        "church_name": profile.church_name,
        "parish_or_pastor": profile.parish_or_pastor,
        "faith_testimony": profile.faith_testimony,
        "is_baptized": profile.is_baptized,
        "highest_education": profile.highest_education,
        "education_field": profile.education_field,
        "occupation_title": profile.occupation_title,
        "employed_in": profile.employed_in,
        "work_location": profile.work_location,
        "annual_income_min": profile.annual_income_min,
        "father_occupation": profile.father_occupation,
        "mother_occupation": profile.mother_occupation,
        "family_values": profile.family_values.value if hasattr(profile.family_values, 'value') else str(profile.family_values) if profile.family_values else None,
        "native_place": profile.native_place,
        "district": profile.district,
        "state": profile.state,
        "country": getattr(profile, "citizenship", "India"),
        "bio": profile.bio,
        "is_locked": False,
        "requires_subscription": False,
        "photos": [
            {
                "id": p.id,
                "r2_url": p.r2_url,
                "is_primary": p.is_primary,
                "status": p.status.value if hasattr(p.status, 'value') else str(p.status),
            }
            for p in photos
        ],
    }


@router.get("/platform-stats", summary="Public Platform Counts & Verified Member Statistics")
async def get_public_platform_stats(db: Session = Depends(get_db)):
    """Provides public live counters for landing page and discovery trust indicators."""
    from backend.app.models.enums import AccountStatus, Gender, ProfileStatus, UserRole

    candidate_users = db.query(User).filter(User.role != UserRole.SUPER_ADMIN)
    total_users = candidate_users.count()
    verified_users = candidate_users.filter(User.is_mobile_verified == True).count()
    active_users = candidate_users.filter(User.account_status == AccountStatus.ACTIVE).count()

    total_profiles = db.query(Profile).count()
    approved_profiles = db.query(Profile).filter(Profile.status == ProfileStatus.APPROVED).count()
    total_brides = db.query(Profile).filter(Profile.status == ProfileStatus.APPROVED, Profile.gender == Gender.FEMALE).count()
    total_grooms = db.query(Profile).filter(Profile.status == ProfileStatus.APPROVED, Profile.gender == Gender.MALE).count()

    return {
        "total_users": total_users,
        "verified_members": verified_users,
        "active_users": active_users,
        "total_profiles": total_profiles,
        "approved_profiles": approved_profiles,
        "total_brides": total_brides,
        "total_grooms": total_grooms,
        "target_region": "Bidar, Karnataka, India",
    }
