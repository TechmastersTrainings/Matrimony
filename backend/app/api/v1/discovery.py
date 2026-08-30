from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.app.core.security import get_current_user
from backend.app.models.enums import ProfileStatus
from backend.app.models.photo import ProfilePhoto
from backend.app.models.profile import Profile
from backend.app.models.user import User
from backend.app.services.database import get_db
from backend.app.services.discovery_service import DiscoveryService

router = APIRouter(prefix="/discovery", tags=["Discovery & Matching"])


@router.get(
    "/search",
    summary="Search & Filter Approved Matrimonial Profiles in Bidar & Surrounding",
)
async def search_profiles(
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
        current_user=current_user,
        db=db,
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
    return {"total": total, "skip": skip, "limit": limit, "profiles": results}


@router.get(
    "/profiles/{profile_id}",
    summary="Get Full Details of a Candidate Profile",
)
async def get_candidate_profile(
    profile_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = db.query(Profile).filter(
        Profile.id == profile_id,
        Profile.status == ProfileStatus.APPROVED,
    ).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found or not approved.")

    photos = (
        db.query(ProfilePhoto)
        .filter(ProfilePhoto.profile_id == profile.id)
        .order_by(ProfilePhoto.is_primary.desc(), ProfilePhoto.order_index.asc())
        .all()
    )

    my_profile = current_user.profile
    match_score = DiscoveryService.calculate_match_score(my_profile, profile)

    return {
        "id": profile.id,
        "user_id": profile.user_id,
        "first_name": profile.first_name,
        "last_name": profile.last_name[:1] + "." if profile.last_name else "",
        "gender": profile.gender.value,
        "age": profile.age,
        "dob": str(profile.dob) if profile.dob else None,
        "marital_status": profile.marital_status.value if profile.marital_status else "NEVER_MARRIED",
        "height_cm": profile.height_cm,
        "weight_kg": profile.weight_kg,
        "physical_status": profile.physical_status.value if profile.physical_status else "NORMAL",
        "mother_tongue": profile.mother_tongue or "Kannada",

        # Faith
        "denomination": profile.denomination.value if profile.denomination else "METHODIST",
        "sub_denomination": profile.sub_denomination,
        "church_name": profile.church_name,
        "parish_or_pastor": profile.parish_or_pastor,
        "is_baptized": profile.is_baptized,
        "is_born_again": profile.is_born_again,
        "church_activity": profile.church_activity,

        # Location
        "state": profile.state or "Karnataka",
        "district": profile.district or "Bidar",
        "city": profile.city or "Bidar",
        "native_place": profile.native_place,

        # Career
        "highest_education": profile.highest_education,
        "education_field": profile.education_field,
        "institution": profile.institution,
        "occupation_type": profile.occupation_type.value if profile.occupation_type else "PRIVATE",
        "occupation_title": profile.occupation_title,
        "employed_in": profile.employed_in,
        "annual_income_min": profile.annual_income_min,
        "work_location": profile.work_location,

        # Family
        "father_name": profile.father_name,
        "father_occupation": profile.father_occupation,
        "mother_name": profile.mother_name,
        "mother_occupation": profile.mother_occupation,
        "family_status": profile.family_status.value if profile.family_status else "MIDDLE_CLASS",
        "family_values": profile.family_values.value if profile.family_values else "TRADITIONAL",
        "brothers_count": profile.brothers_count,
        "married_brothers_count": profile.married_brothers_count,
        "sisters_count": profile.sisters_count,
        "married_sisters_count": profile.married_sisters_count,
        "about_family": profile.about_family,

        # Lifestyle & About
        "diet": profile.diet.value if profile.diet else "NON_VEGETARIAN",
        "smoking": profile.smoking.value if profile.smoking else "NO",
        "drinking": profile.drinking.value if profile.drinking else "NO",
        "hobbies": profile.hobbies,
        "bio": profile.bio,
        "faith_testimony": profile.faith_testimony,
        "partner_preferences": profile.partner_preferences,

        # Photos
        "photos": [
            {"id": p.id, "r2_url": p.r2_url, "thumbnail_url": p.thumbnail_url, "is_primary": p.is_primary}
            for p in photos
        ],
        "match_score": match_score,
    }
