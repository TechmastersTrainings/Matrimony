from datetime import datetime, timedelta
import pytest
from backend.app.models.enums import Gender, ModerationCategory, ModerationAction, ModerationSeverity
from backend.app.models.interaction import ChatMessage
from backend.app.models.user import User
from backend.app.models.profile import Profile
from backend.app.services.normalization_service import NormalizationService
from backend.app.services.contact_detection_service import ContactDetectionService
from backend.app.services.ai_chat_safety_service import AIChatSafetyService
from backend.app.services.chat_policy_engine import ChatPolicyEngine
from backend.app.services.chat_service import ChatService


def test_normalization_leetspeak_and_numbers():
    # Test zero-width and leetspeak conversion
    cleaned = NormalizationService.clean_unicode("9\u200b8\u200b8\u200b0")
    assert "9880" in cleaned

    # Test spelled number translation English
    eng_spelled = "NINE EIGHT EIGHT ZERO SEVEN SIX EIGHT TWO TWO TWO"
    num_str = NormalizationService.expand_number_words(eng_spelled)
    assert "9880768222" in num_str.replace(" ", "")

    # Test Hindi number words
    hindi_spelled = "nau aath aath shunya saat chhe aath do do do"
    h_digits = NormalizationService.expand_number_words(hindi_spelled)
    assert "9880768222" in h_digits.replace(" ", "")

    # Test Kannada number words
    kannada_spelled = "ombhattu entu entu sonne elu aaru entu eradu eradu eradu"
    k_digits = NormalizationService.expand_number_words(kannada_spelled)
    assert "9880768222" in k_digits.replace(" ", "")

    # Test multipliers
    multiplier_text = "call double nine triple eight"
    m_digits = NormalizationService.expand_number_words(multiplier_text)
    assert "9 9" in m_digits or "99" in m_digits.replace(" ", "")
    assert "8 8 8" in m_digits or "888" in m_digits.replace(" ", "")


def test_contact_detection_prohibited_variations():
    # 1. Spelled English numbers
    det1 = ContactDetectionService.evaluate_message("My number is NINE EIGHT EIGHT ZERO SEVEN SIX EIGHT TWO TWO TWO call me")
    assert det1.is_violation is True
    assert "[CONTACT INFORMATION HIDDEN]" in det1.sanitized_text

    # 2. Spaced numbers
    det2 = ContactDetectionService.evaluate_message("ping me on 9 8 8 0 7 6 8 2 2 2")
    assert det2.is_violation is True
    assert "[CONTACT INFORMATION HIDDEN]" in det2.sanitized_text

    # 3. Dashed numbers
    det3 = ContactDetectionService.evaluate_message("Reach me at 988-076-8222")
    assert det3.is_violation is True
    assert "[CONTACT INFORMATION HIDDEN]" in det3.sanitized_text

    # 4. Mixed digits and words
    det4 = ContactDetectionService.evaluate_message("Contact: 988 zero seven 6 eight 222")
    assert det4.is_violation is True
    assert "[CONTACT INFORMATION HIDDEN]" in det4.sanitized_text

    # 5. Obfuscated email
    det5 = ContactDetectionService.evaluate_message("email me at bride [at] gmail [dot] com")
    assert det5.is_violation is True
    assert ModerationCategory.EMAIL in det5.categories
    assert "[CONTACT INFORMATION HIDDEN]" in det5.sanitized_text

    # 6. Telegram handle
    det6 = ContactDetectionService.evaluate_message("connect with me on telegram @christian_groom")
    assert det6.is_violation is True
    assert "[CONTACT INFORMATION HIDDEN]" in det6.sanitized_text

    # 7. External platform migration intent
    det7 = ContactDetectionService.evaluate_message("send your contact number please")
    assert det7.is_violation is True
    assert ModerationCategory.CONTACT_SHARING_INTENT in det7.categories


def test_contact_detection_safe_whitelisted_numbers():
    # Years, Bible verses, age, and normal conversation must NOT be false positives
    safe1 = ContactDetectionService.evaluate_message("I was born in 1996 and graduated college in 2018.")
    assert safe1.is_violation is False
    assert safe1.sanitized_text == "I was born in 1996 and graduated college in 2018."

    safe2 = ContactDetectionService.evaluate_message("Psalm 23 and John 3:16 bring me great peace.")
    assert safe2.is_violation is False
    assert "Psalm 23" in safe2.sanitized_text

    safe3 = ContactDetectionService.evaluate_message("I am 28 years old and my sister is 25.")
    assert safe3.is_violation is False

    safe4 = ContactDetectionService.evaluate_message("Praise the Lord! Hope you are having a blessed Sunday.")
    assert safe4.is_violation is False


def test_ai_courtship_suggestions_multilingual(db_session):
    # Setup test user and candidate
    sender = User(email="groom_test@example.com", mobile_number="9876543210")
    receiver = User(email="bride_test@example.com", mobile_number="9876543211")
    db_session.add_all([sender, receiver])
    db_session.commit()

    r_prof = Profile(user_id=receiver.id, first_name="Hannah", last_name="David", gender=Gender.FEMALE, district="Bidar")
    db_session.add(r_prof)
    db_session.commit()

    # English
    en_sugg = AIChatSafetyService.get_conversation_suggestions(sender, receiver.id, db_session, language="en")
    assert en_sugg["language"] == "en"
    assert len(en_sugg["categories"]["greetings"]) > 0
    assert len(en_sugg["categories"]["dating_and_meeting"]) > 0
    assert "date" in en_sugg["categories"]["dating_and_meeting"][0]["text"].lower() or "meet" in en_sugg["categories"]["dating_and_meeting"][0]["text"].lower()

    # Kannada
    kn_sugg = AIChatSafetyService.get_conversation_suggestions(sender, receiver.id, db_session, language="kn")
    assert kn_sugg["language"] == "kn"
    assert len(kn_sugg["categories"]["greetings"]) > 0
    assert "ಪ್ರೈಸ್" in kn_sugg["categories"]["greetings"][0]["text"]

    # Hindi
    hi_sugg = AIChatSafetyService.get_conversation_suggestions(sender, receiver.id, db_session, language="hi")
    assert hi_sugg["language"] == "hi"
    assert len(hi_sugg["categories"]["greetings"]) > 0
    assert "प्रभु" in hi_sugg["categories"]["greetings"][0]["text"]


def test_ephemeral_4_hour_purge(db_session):
    u1 = User(email="u1@example.com", mobile_number="9998887771")
    u2 = User(email="u2@example.com", mobile_number="9998887772")
    db_session.add_all([u1, u2])
    db_session.commit()

    # 1. Insert an expired message (> 4 hours old)
    five_hours_ago = datetime.utcnow() - timedelta(hours=5)
    expired_msg = ChatMessage(
        sender_id=u1.id,
        receiver_id=u2.id,
        message_text="Old message that must be wiped",
        created_at=five_hours_ago,
    )
    # 2. Insert an active message (within 4 hours)
    one_hour_ago = datetime.utcnow() - timedelta(hours=1)
    active_msg = ChatMessage(
        sender_id=u1.id,
        receiver_id=u2.id,
        message_text="Recent active message",
        created_at=one_hour_ago,
    )
    db_session.add_all([expired_msg, active_msg])
    db_session.commit()

    # Run purge
    purged_count = ChatService.purge_expired_messages(db_session)
    assert purged_count >= 1

    # Verify database state
    remaining = db_session.query(ChatMessage).filter(ChatMessage.sender_id == u1.id).all()
    assert len(remaining) == 1
    assert remaining[0].message_text == "Recent active message"
