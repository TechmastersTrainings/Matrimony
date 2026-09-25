from datetime import datetime, timezone
import pytest
from sqlalchemy.orm import Session

from backend.app.models.enums import (
    AccountStatus,
    Denomination,
    Gender,
    InterestStatus,
    MaritalStatus,
    ProfileStatus,
    SubscriptionPlanCode,
    UserRole,
)
from backend.app.models.interaction import ChatMessage, UserInterest
from backend.app.models.profile import Profile
from backend.app.models.subscription import SubscriptionPlan, UserSubscription
from backend.app.models.user import User
from backend.app.services.chat_service import ChatService
from backend.app.services.interaction_service import InteractionService


def test_interest_accept_reject_and_chatbox_workflow(db_session: Session):
    """
    Validates end-to-end interest expression, acceptance/rejection,
    chat permission unlocking, and candidate profile loading in the chatbox.
    """
    # 1. Seed Subscription Plan
    plan = db_session.query(SubscriptionPlan).filter(SubscriptionPlan.plan_code == SubscriptionPlanCode.STANDARD).first()
    if not plan:
        plan = SubscriptionPlan(
            name="Standard Christian Plan",
            plan_code=SubscriptionPlanCode.STANDARD,
            price_inr=349,
            duration_days=70,
            contact_reveals_limit=10,
            features=["unlimited_interests"],
            is_active=True,
        )
        db_session.add(plan)
        db_session.commit()
        db_session.refresh(plan)

    # 2. Create Groom Candidate
    groom_user = User(
        mobile_number="9876543210",
        email="groom_workflow@example.com",
        account_status=AccountStatus.ACTIVE,
        role=UserRole.CANDIDATE,
        is_mobile_verified=True,
        is_email_verified=True,
    )
    db_session.add(groom_user)
    db_session.flush()

    groom_profile = Profile(
        user_id=groom_user.id,
        first_name="David",
        last_name="Paul",
        gender=Gender.MALE,
        status=ProfileStatus.APPROVED,
        age=28,
        height_cm=178,
        marital_status=MaritalStatus.NEVER_MARRIED,
        denomination=Denomination.CSI,
        church_name="CSI Cathedral Bangalore",
        district="Bangalore",
        state="Karnataka",
        highest_education="B.E. Computer Science",
        occupation_title="Software Architect",
        bio="Devout believer seeking a God-fearing Christian bride.",
    )
    db_session.add(groom_profile)

    # Groom active subscription
    groom_sub = UserSubscription(
        user_id=groom_user.id,
        plan_id=plan.id,
        status="ACTIVE",
        start_date=datetime.now(timezone.utc).replace(tzinfo=None),
        end_date=datetime.now(timezone.utc).replace(tzinfo=None),
    )
    db_session.add(groom_sub)

    # 3. Create Bride Candidate
    bride_user = User(
        mobile_number="9876543211",
        email="bride_workflow@example.com",
        account_status=AccountStatus.ACTIVE,
        role=UserRole.CANDIDATE,
        is_mobile_verified=True,
        is_email_verified=True,
    )
    db_session.add(bride_user)
    db_session.flush()

    bride_profile = Profile(
        user_id=bride_user.id,
        first_name="Ruth",
        last_name="Grace",
        gender=Gender.FEMALE,
        status=ProfileStatus.APPROVED,
        age=25,
        height_cm=165,
        marital_status=MaritalStatus.NEVER_MARRIED,
        denomination=Denomination.CSI,
        church_name="St. Mark's Cathedral",
        district="Bangalore",
        state="Karnataka",
        highest_education="M.Sc Clinical Psychology",
        occupation_title="Counselling Psychologist",
        bio="Loving Christian seeking a partner with shared biblical values.",
    )
    db_session.add(bride_profile)

    # Bride active subscription
    bride_sub = UserSubscription(
        user_id=bride_user.id,
        plan_id=plan.id,
        status="ACTIVE",
        start_date=datetime.now(timezone.utc).replace(tzinfo=None),
        end_date=datetime.now(timezone.utc).replace(tzinfo=None),
    )
    db_session.add(bride_sub)
    db_session.commit()

    # 4. Groom sends matrimonial interest to Bride
    interest = InteractionService.send_interest(
        sender=groom_user,
        target_user_id=bride_user.id,
        message="Praise the Lord! I was blessed reading your profile.",
        db=db_session,
    )
    assert interest.id is not None
    assert interest.status == InterestStatus.PENDING

    # Chat permission should be False while interest is pending
    assert ChatService.check_chat_permission(groom_user.id, bride_user.id, db_session) is False

    # 5. Bride declines (tests rejection action)
    rejected_interest = InteractionService.respond_interest(
        user=bride_user,
        interest_id=interest.id,
        accept=False,
        db=db_session,
    )
    assert rejected_interest.status == InterestStatus.DECLINED
    assert ChatService.check_chat_permission(groom_user.id, bride_user.id, db_session) is False

    # 6. Re-sending and Bride accepts
    reopened_interest = InteractionService.send_interest(
        sender=groom_user,
        target_user_id=bride_user.id,
        message="Greetings in Christ! Would love to connect families.",
        db=db_session,
    )
    assert reopened_interest.status == InterestStatus.PENDING

    accepted_interest = InteractionService.respond_interest(
        user=bride_user,
        interest_id=reopened_interest.id,
        accept=True,
        db=db_session,
    )
    assert accepted_interest.status == InterestStatus.ACCEPTED

    # 7. Verify Chat Permission is now unlocked for BOTH Groom & Bride
    assert ChatService.check_chat_permission(groom_user.id, bride_user.id, db_session) is True
    assert ChatService.check_chat_permission(bride_user.id, groom_user.id, db_session) is True

    # 8. Verify get_user_conversations includes full candidate profile in chatbox data
    conversations = ChatService.get_user_conversations(groom_user, db_session)
    assert len(conversations) == 1
    conv = conversations[0]
    assert conv["other_user_id"] == bride_user.id
    assert conv["other_user"]["first_name"] == "Ruth"
    assert conv["other_user"]["gender"] == "FEMALE"
    assert conv["other_user"]["age"] == 25
    assert conv["other_user"]["denomination"] == "CSI"
    assert conv["other_user"]["highest_education"] == "M.Sc Clinical Psychology"

    # 9. Verify get_partner_profile returns verified candidate details
    partner_prof = ChatService.get_partner_profile(groom_user.id, bride_user.id, db_session)
    assert partner_prof is not None
    assert partner_prof["first_name"] == "Ruth"
    assert partner_prof["occupation_title"] == "Counselling Psychologist"

    # 10. Verify bidirectional message exchange within in-app chat
    msg1 = ChatService.send_message(
        sender=groom_user,
        receiver_id=bride_user.id,
        text="Praise the Lord Ruth! How was your Sunday service?",
        db=db_session,
    )
    assert msg1.id is not None
    assert msg1.message_text == "Praise the Lord Ruth! How was your Sunday service?"

    msg2 = ChatService.send_message(
        sender=bride_user,
        receiver_id=groom_user.id,
        text="Greetings David! The service was blessed. Thank you for connecting.",
        db=db_session,
    )
    assert msg2.id is not None
    assert msg2.message_text == "Greetings David! The service was blessed. Thank you for connecting."

    # 11. Retrieve conversation history
    history = ChatService.get_conversation(user=groom_user, other_user_id=bride_user.id, db=db_session)
    assert len(history) == 2
    assert history[0]["message_text"] == "Praise the Lord Ruth! How was your Sunday service?"
    assert history[0]["is_me"] is True
    assert history[1]["is_me"] is False
