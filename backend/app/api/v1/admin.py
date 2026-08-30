from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.app.core.security import get_current_user
from backend.app.models.enums import AccountStatus, UserRole
from backend.app.models.profile import Profile
from backend.app.models.user import User
from backend.app.schemas.profile import ProfileDetailResponse
from backend.app.services.database import get_db

router = APIRouter(prefix="/admin", tags=["Admin Foundation"])


@router.get(
    "/users",
    summary="List Registered Users and Account/Profile Statuses",
)
async def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status_filter: Optional[AccountStatus] = None,
    db: Session = Depends(get_db),
):
    if db is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable.")

    query = db.query(User)
    if status_filter:
        query = query.filter(User.account_status == status_filter)

    total = query.count()
    users = query.order_by(User.id.desc()).offset(skip).limit(limit).all()

    result = []
    for u in users:
        p = u.profile
        result.append({
            "id": u.id,
            "mobile_number": u.mobile_number,
            "email": u.email,
            "account_status": u.account_status.value,
            "role": u.role.value,
            "is_mobile_verified": u.is_mobile_verified,
            "is_email_verified": u.is_email_verified,
            "first_name": p.first_name if p else "",
            "last_name": p.last_name if p else "",
            "profile_status": p.status.value if p else "DRAFT",
            "completion_percentage": p.completion_percentage if p else 15,
            "denomination": p.denomination.value if p and p.denomination else None,
            "city": p.city if p else "Bidar",
            "created_at": u.created_at,
            "last_login_at": u.last_login_at,
        })

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "users": result,
    }


@router.get(
    "/users/{user_id}",
    summary="Get Specific User & Profile Details for Admin Inspection",
)
async def get_user_details(
    user_id: int,
    db: Session = Depends(get_db),
):
    if db is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable.")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    p = user.profile
    profile_data = ProfileDetailResponse.model_validate(p) if p else None

    return {
        "user_id": user.id,
        "mobile_number": user.mobile_number,
        "email": user.email,
        "account_status": user.account_status.value,
        "role": user.role.value,
        "is_mobile_verified": user.is_mobile_verified,
        "is_email_verified": user.is_email_verified,
        "created_at": user.created_at,
        "last_login_at": user.last_login_at,
        "profile": profile_data,
    }
