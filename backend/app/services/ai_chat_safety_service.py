from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session

from backend.app.core.logger import logger
from backend.app.models.profile import Profile
from backend.app.models.user import User
from backend.app.services.contact_detection_service import ContactDetectionService


class AIChatSafetyService:
    @staticmethod
    def get_conversation_suggestions(
        user: User,
        other_user_id: int,
        db: Session,
        language: str = "en",
    ) -> Dict[str, Any]:
        """
        Generates context-aware, respectful Christian matrimonial conversation suggestions
        categorized into: Greetings, Dating & Meeting, Faith & Church, Family Values, and Career.
        Supports English ('en'), Kannada ('kn'), and Hindi ('hi').
        """
        lang = (language or "en").lower().strip()
        if lang not in ["en", "kn", "hi"]:
            lang = "en"

        other_profile = db.query(Profile).filter(Profile.user_id == other_user_id).first()
        name = other_profile.first_name if other_profile and other_profile.first_name else "Candidate"
        denomination = (
            other_profile.denomination.value
            if other_profile and other_profile.denomination
            else "Christian"
        )
        church = other_profile.church_name if other_profile and other_profile.church_name else "Local Church"
        district = other_profile.district if other_profile and other_profile.district else "Bidar"

        # Multi-lingual suggestions catalogue
        suggestions: Dict[str, List[Dict[str, str]]] = {
            "greetings": [],
            "dating_and_meeting": [],
            "faith_and_church": [],
            "family_values": [],
            "career_and_life": [],
        }

        if lang == "kn":
            suggestions["greetings"] = [
                {"id": "g1", "text": f"ಪ್ರೈಸ್ ದ ಲಾರ್ಡ್! ನಮಸ್ಕಾರ {name}, ಹೇಗಿದ್ದೀರಾ?"},
                {"id": "g2", "text": "ನಿಮ್ಮೊಂದಿಗೆ ಸಂಪರ್ಕ ಸಾಧಿಸಲು ನನಗೆ ತುಂಬಾ ಸಂತೋಷವಾಗಿದೆ."},
                {"id": "g3", "text": "ನನ್ನ ಮ್ಯಾಟ್ರಿಮೋನಿಯಲ್ ಆಸಕ್ತಿಯನ್ನು ಸ್ವೀಕರಿಸಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು."},
                {"id": "g4", "text": "ದೇವರ ಆಶೀರ್ವಾದ ಸದಾ ನಿಮ್ಮೊಂದಿಗೆ ಇರಲಿ. ನಿಮ್ಮ ದಿನ ಹೇಗಿತ್ತು?"},
            ]
            suggestions["dating_and_meeting"] = [
                {"id": "dm1", "text": f"ನಾವು ಈ ವಾರಾಂತ್ಯದಲ್ಲಿ {district}ನಲ್ಲಿ ಕಾಫಿ ಡೇಟ್‌ಗೆ ಭೇಟಿ ನೀಡಬಹುದೇ?"},
                {"id": "dm2", "text": "ಪರಸ್ಪರ ಚೆನ್ನಾಗಿ ತಿಳಿದುಕೊಳ್ಳಲು ನಾವು ಮುಖಾಮುಖಿಯಾಗಿ ಭೇಟಿಯಾಗಬಹುದೇ?"},
                {"id": "dm3", "text": "ನಮ್ಮ ಕುಟುಂಬಗಳ ನಡುವೆ ಭೇಟಿ ಮತ್ತು ಪ್ರಾರ್ಥನಾ ಕೂಟವನ್ನು ಯೋಜಿಸಬಹುದೇ?"},
                {"id": "dm4", "text": "ಭಾನುವಾರದ ಆರಾಧನೆಯ ನಂತರ ಸ್ವಲ್ಪ ಸಮಯ ಮಾತನಾಡಲು ಭೇಟಿಯಾಗೋಣವೇ?"},
            ]
            suggestions["faith_and_church"] = [
                {"id": "fc1", "text": f"{district}ನಲ್ಲಿ ನೀವು ಯಾವ ಚರ್ಚ್ ಮತ್ತು ಧರ್ಮಸಭೆಗೆ ಹಾಜರಾಗುತ್ತೀರಿ?"},
                {"id": "fc2", "text": "ನಿಮ್ಮ ದೈನಂದಿನ ಜೀವನದಲ್ಲಿ ಅತ್ಯಂತ ಪ್ರಮುಖವಾದ ಕ್ರಿಶ್ಚಿಯನ್ ಮೌಲ್ಯಗಳು ಯಾವುವು?"},
                {"id": "fc3", "text": "ನೀವು ಚರ್ಚ್ ಗಾಯನ ಮಂಡಳಿ ಅಥವಾ ಯುವಜನ ಸಭೆಯಲ್ಲಿ ಭಾಗವಹಿಸುತ್ತೀರಾ?"},
                {"id": "fc4", "text": "ನಿಮ್ಮ ಜೀವನದಲ್ಲಿ ನಿಮಗೆ ಪ್ರೇರಣೆ ನೀಡುವ ಪ್ರಮುಖ ಬೈಬಲ್ ವಚನ ಯಾವುದು?"},
            ]
            suggestions["family_values"] = [
                {"id": "fv1", "text": "ನಿಮ್ಮ ಕುಟುಂಬ ಮತ್ತು ಮನೆತನದ ಸಂಪ್ರದಾಯಗಳ ಬಗ್ಗೆ ಸ್ವಲ್ಪ ತಿಳಿಸುವಿರಾ?"},
                {"id": "fv2", "text": "ನಿಮ್ಮ ಕುಟುಂಬವು ಭಾನುವಾರದ ಸಮಯವನ್ನು ಒಟ್ಟಾಗಿ ಹೇಗೆ ಕಳೆಯುತ್ತದೆ?"},
                {"id": "fv3", "text": "ಕ್ರಿಸ್ತ-ಕೇಂದ್ರಿತ ಕುಟುಂಬವನ್ನು ನಿರ್ಮಿಸುವ ಬಗ್ಗೆ ನಿಮ್ಮ ಕನಸುಗಳೇನು?"},
            ]
            suggestions["career_and_life"] = [
                {"id": "cl1", "text": "ನಿಮ್ಮ ವೃತ್ತಿಜೀವನ ಹೇಗಿದೆ ಮತ್ತು ಬಿಡುವಿನ ವೇಳೆಯಲ್ಲಿ ಏನು ಮಾಡಲು ಇಷ್ಟಪಡುತ್ತೀರಿ?"},
                {"id": "cl2", "text": "ಮುಂದಿನ ವರ್ಷಗಳಲ್ಲಿ ನಿಮ್ಮ ವೃತ್ತಿಪರ ಮತ್ತು ಜೀವನದ ಗುರಿಗಳೇನು?"},
            ]
        elif lang == "hi":
            suggestions["greetings"] = [
                {"id": "g1", "text": f"प्रभु की स्तुति हो! नमस्ते {name}, आप आज कैसे हैं?"},
                {"id": "g2", "text": "आपसे जुड़कर बहुत आनंद और खुशी हुई।"},
                {"id": "g3", "text": "मेरी वैवाहिक रुचि स्वीकार करने के लिए हृदय से धन्यवाद।"},
                {"id": "g4", "text": "प्रभु आपको आशीष दे! आपका आज का दिन कैसा रहा?"},
            ]
            suggestions["dating_and_meeting"] = [
                {"id": "dm1", "text": f"क्या हम इस सप्ताहांत {district} में एक कॉफ़ी डेट पर मिल सकते हैं?"},
                {"id": "dm2", "text": "एक-दूसरे को बेहतर जानने के लिए क्या हम व्यक्तिगत रूप से मुलाकात कर सकते हैं?"},
                {"id": "dm3", "text": "क्या हमारे परिवारों के बीच एक शिष्टाचार मुलाकात की योजना बनाई जा सकती है?"},
                {"id": "dm4", "text": "रविवार की प्रार्थना सभा के बाद क्या हम थोड़ी देर मिल सकते हैं?"},
            ]
            suggestions["faith_and_church"] = [
                {"id": "fc1", "text": f"आप {district} में किस कलीसिया या पल्ली में संगति के लिए जाते हैं?"},
                {"id": "fc2", "text": "मसीही जीवन में आपके लिए सबसे महत्वपूर्ण आध्यात्मिक मूल्य क्या हैं?"},
                {"id": "fc3", "text": "क्या आप चर्च के कॉयर या युवा संगति में सक्रिय रूप से भाग लेते हैं?"},
                {"id": "fc4", "text": "आपका पसंदीदा बाइबल वचन कौन सा है जो आपको प्रतिदिन प्रेरणा देता है?"},
            ]
            suggestions["family_values"] = [
                {"id": "fv1", "text": "अपने परिवार और घर की सुंदर परंपराओं के बारे में कुछ बताएं?"},
                {"id": "fv2", "text": "आपका परिवार रविवार की शाम को एक साथ कैसे व्यतीत करता है?"},
                {"id": "fv3", "text": "प्रभु पर आधारित एक पवित्र मसीही परिवार बनाने के बारे में आपकी क्या सोच है?"},
            ]
            suggestions["career_and_life"] = [
                {"id": "cl1", "text": "आपका काम कैसा चल रहा है, और खाली समय में आपको क्या करना पसंद है?"},
                {"id": "cl2", "text": "आने वाले वर्षों के लिए आपके करियर और जीवन के क्या लक्ष्य हैं?"},
            ]
        else:
            # English (Default)
            suggestions["greetings"] = [
                {"id": "g1", "text": f"Praise the Lord! Hello {name}, how are you today?"},
                {"id": "g2", "text": f"Hi {name}! It is a blessing to connect with you."},
                {"id": "g3", "text": "Hello! Thank you for accepting my interest. Wishing you a blessed week."},
                {"id": "g4", "text": "Praise the Lord! Hope you are having a wonderful and peaceful day."},
            ]
            suggestions["dating_and_meeting"] = [
                {"id": "dm1", "text": f"Shall we meet for a coffee date this weekend in {district}?"},
                {"id": "dm2", "text": "Would you like to meet in person to get to know each other better?"},
                {"id": "dm3", "text": "Can we arrange a peaceful meeting for our families to connect for fellowship?"},
                {"id": "dm4", "text": "Shall we meet for a brief walk or fellowship after Sunday service?"},
            ]
            suggestions["faith_and_church"] = [
                {"id": "fc1", "text": f"Which church or fellowship do you attend in {district}?"},
                {"id": "fc2", "text": "What Christian values and biblical teachings are most central in your daily life?"},
                {"id": "fc3", "text": "Do you actively participate in church choir, ministry, or Sunday school?"},
                {"id": "fc4", "text": "What is your favorite scripture passage that brings you peace and strength?"},
            ]
            suggestions["family_values"] = [
                {"id": "fv1", "text": "Could you share a little about your family and your cherished home traditions?"},
                {"id": "fv2", "text": "How does your family celebrate Sunday fellowship and prayer time together?"},
                {"id": "fv3", "text": "What are your hopes and prayers for building a Christ-centered family?"},
            ]
            suggestions["career_and_life"] = [
                {"id": "cl1", "text": "How is your work going, and what hobbies do you enjoy during weekends?"},
                {"id": "cl2", "text": "What are your aspirations for your career and family life in the coming years?"},
            ]

        # Double-check all suggestions through ContactDetectionService to guarantee zero PII leaks
        safe_suggestions = {}
        for cat, items in suggestions.items():
            safe_list = []
            for item in items:
                det = ContactDetectionService.evaluate_message(item["text"])
                if not det.is_violation:
                    safe_list.append(item)
            safe_suggestions[cat] = safe_list

        return {
            "language": lang,
            "candidate_name": name,
            "district": district,
            "denomination": denomination,
            "categories": safe_suggestions,
        }
