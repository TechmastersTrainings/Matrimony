import re
from dataclasses import dataclass
from typing import List, Optional, Set, Tuple

from backend.app.models.enums import ModerationCategory
from backend.app.services.normalization_service import NormalizationService


@dataclass
class DetectionResult:
    is_violation: bool
    categories: List[ModerationCategory]
    sanitized_text: str
    detected_snippets: List[str]
    intent_flagged: bool = False
    details: Optional[str] = None


class ContactDetectionService:
    # ------------------ PATTERNS ------------------

    # Email detection (standard & obfuscated)
    EMAIL_REGEX = re.compile(
        r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+",
        re.IGNORECASE,
    )
    OBFUSCATED_EMAIL_REGEX = re.compile(
        r"\b[a-zA-Z0-9_.+-]+\s*(?:\[at\]|\(at\)|\bat\b|@)\s*[a-zA-Z0-9-]+\s*(?:\[dot\]|\(dot\)|\bdot\b|\.)\s*(?:com|in|org|net|co\.in|gmail|yahoo|outlook|hotmail)\b",
        re.IGNORECASE,
    )

    # External URLs & messaging links
    URL_REGEX = re.compile(
        r"(?:https?://|www\.)[^\s/$.?#].[^\s]*|(?:\b(?:wa\.me|t\.me|bit\.ly|tinyurl\.com|linktr\.ee|instagram\.com|facebook\.com)/[^\s]+)",
        re.IGNORECASE,
    )

    # UPI IDs (e.g. name@upi, name@okhdfcbank, name@paytm)
    UPI_REGEX = re.compile(
        r"\b[a-zA-Z0-9.\-_]{2,256}@(upi|okhdfcbank|oksbi|okaxis|okicici|paytm|ybl|axl|ibl|barodampay|federal|allbank)\b",
        re.IGNORECASE,
    )

    # Social media handles / instructions
    SOCIAL_HANDLE_REGEX = re.compile(
        r"(?:(?:insta(?:gram)?|tg|telegram|snap(?:chat)?|fb|facebook)\s*[:\-@]?\s*@[a-zA-Z0-9_.]+|\b@[a-zA-Z0-9_.]{4,25}\b)",
        re.IGNORECASE,
    )

    # Obvious Contact Sharing Intent Phrases (e.g. "call me", "whatsapp me", "save my number")
    INTENT_PHRASES = [
        r"\b(?:whatsapp|whats\s*app|wa)\s*(?:me|number|num|no|msg|ping)\b",
        r"\b(?:call|text|msg|ping)\s*me\s*(?:on|at|after|privately)?\b",
        r"\b(?:my|dis)\s*(?:contact|number|num|ph|phone|mob|mobile|digits?|cell)\s*(?:is|are|details)?\b",
        r"\b(?:save|note)\s*(?:this|my)\s*(?:number|contact|digits)\b",
        r"\b(?:message|contact)\s*me\s*(?:privately|offline|outside)\b",
        r"\b(?:send|give)\s*(?:me\s*)?(?:your\s*)?(?:number|contact|phone|ph)\b",
        r"\b(?:i'?ll|will)\s*(?:give|send|share)\s*(?:you\s*)?(?:my\s*)?(?:number|contact|ph)\b",
    ]
    INTENT_REGEX = re.compile("|".join(INTENT_PHRASES), re.IGNORECASE)

    # Safe standalone numbers whitelist (e.g. years, Bible verses, small numbers)
    SAFE_YEAR_REGEX = re.compile(r"\b(19\d{2}|20[0-3]\d)\b")
    BIBLE_VERSE_REGEX = re.compile(
        r"\b(?:genesis|exodus|psalm|psalms|proverbs|matthew|mark|luke|john|acts|romans|corinthians|galatians|ephesians|philippians|colossians|thessalonians|timothy|titus|hebrews|james|peter|jude|revelation)\s*\d+[:\-]\d+\b",
        re.IGNORECASE,
    )

    REPLACEMENT_TAG = "[CONTACT INFORMATION HIDDEN]"

    @classmethod
    def extract_phone_numbers(cls, text: str) -> List[Tuple[str, str, int, int]]:
        """
        Detects Indian phone numbers (formatted, spaced, spelled-out, mixed words & digits).
        Returns list of (normalized_number, raw_matched_substring, start_index, end_index).
        """
        matches = []
        if not text:
            return matches

        # 1. Expand spelled number words and leetspeak
        expanded_text = NormalizationService.normalize_for_detection(text)

        # 2. Look for phone digit sequences in expanded text:
        # Indian numbers are 10 digits (optionally prefixed by +91, 91, or 0)
        # Separators can be spaces, dots, hyphens, brackets
        phone_digit_pattern = re.compile(
            r"(?:(?:\+?91|0)[\s\-_./]*)?(?:[6-9][\s\-_./]*\d[\s\-_./]*\d[\s\-_./]*\d[\s\-_./]*\d[\s\-_./]*\d[\s\-_./]*\d[\s\-_./]*\d[\s\-_./]*\d[\s\-_./]*\d)",
            re.IGNORECASE,
        )

        for match in phone_digit_pattern.finditer(expanded_text):
            raw_match = match.group(0)
            # Strip all non-digit characters
            digits = re.sub(r"\D", "", raw_match)

            # Strip country prefix if 11 or 12 digits
            clean_digits = digits
            if len(digits) == 12 and digits.startswith("91"):
                clean_digits = digits[2:]
            elif len(digits) == 11 and digits.startswith("0"):
                clean_digits = digits[1:]

            # Validate valid Indian 10-digit mobile number (starts with 6, 7, 8, 9)
            if len(clean_digits) == 10 and clean_digits[0] in "6789":
                matches.append((clean_digits, raw_match, match.start(), match.end()))

        # 3. Detect spaced digit clusters that equal 10 digits
        # e.g., "9 8 8 0 7 6 8 2 2 2" or "98 80 76 82 22"
        spaced_pattern = re.compile(r"\b(?:\d[\s\-_./]{1,3}){9,11}\d\b")
        for match in spaced_pattern.finditer(expanded_text):
            raw_match = match.group(0)
            digits = re.sub(r"\D", "", raw_match)
            if len(digits) == 10 and digits[0] in "6789":
                matches.append((digits, raw_match, match.start(), match.end()))

        # 4. Fallback check for original raw text (in case spelled words matched directly)
        raw_spelled_pattern = re.compile(
            r"\b(?:zero|one|two|three|four|five|six|seven|eight|nine|shunya|ek|do|teen|chaar|paanch|chhe|saat|aath|nau|sonne|ondu|eradu|mooru|naalku|aidu|aaru|elu|entu|ombhattu)(?:[\s\-_,]+(?:zero|one|two|three|four|five|six|seven|eight|nine|shunya|ek|do|teen|chaar|paanch|chhe|saat|aath|nau|sonne|ondu|eradu|mooru|naalku|aidu|aaru|elu|entu|ombhattu)){6,12}\b",
            re.IGNORECASE,
        )
        for match in raw_spelled_pattern.finditer(text):
            expanded_sub = NormalizationService.expand_number_words(match.group(0))
            digits = re.sub(r"\D", "", expanded_sub)
            if len(digits) >= 7:
                matches.append((digits, match.group(0), match.start(), match.end()))

        return matches

    @classmethod
    def evaluate_message(cls, text: str) -> DetectionResult:
        """
        Runs comprehensive deterministic and heuristic checks on the incoming text.
        Produces sanitized text with prohibited content securely redacted.
        """
        if not text or not text.strip():
            return DetectionResult(
                is_violation=False,
                categories=[],
                sanitized_text=text,
                detected_snippets=[],
            )

        categories: Set[ModerationCategory] = set()
        detected_snippets: List[str] = []
        sanitized = text

        # 1. Check for standard & obfuscated Emails
        for email_match in cls.EMAIL_REGEX.finditer(text):
            categories.add(ModerationCategory.EMAIL)
            snippet = email_match.group(0)
            detected_snippets.append(f"email: {snippet[:3]}***")
            sanitized = sanitized.replace(snippet, cls.REPLACEMENT_TAG)

        for obf_email in cls.OBFUSCATED_EMAIL_REGEX.finditer(text):
            categories.add(ModerationCategory.EMAIL)
            snippet = obf_email.group(0)
            detected_snippets.append("obfuscated_email")
            sanitized = sanitized.replace(snippet, cls.REPLACEMENT_TAG)

        # 2. Check for External URLs
        for url_match in cls.URL_REGEX.finditer(text):
            snippet = url_match.group(0)
            if "wa.me" in snippet.lower():
                categories.add(ModerationCategory.WHATSAPP_CONTACT)
            elif "t.me" in snippet.lower():
                categories.add(ModerationCategory.TELEGRAM_CONTACT)
            else:
                categories.add(ModerationCategory.EXTERNAL_URL)
            detected_snippets.append("external_url")
            sanitized = sanitized.replace(snippet, cls.REPLACEMENT_TAG)

        # 3. Check for UPI IDs
        for upi_match in cls.UPI_REGEX.finditer(text):
            categories.add(ModerationCategory.UPI_ID)
            snippet = upi_match.group(0)
            detected_snippets.append("upi_id")
            sanitized = sanitized.replace(snippet, cls.REPLACEMENT_TAG)

        # 4. Check for Social Handles
        for social_match in cls.SOCIAL_HANDLE_REGEX.finditer(text):
            snippet = social_match.group(0)
            # Disregard common legitimate words starting with @
            if len(snippet) > 4:
                categories.add(ModerationCategory.SOCIAL_HANDLE)
                detected_snippets.append("social_handle")
                sanitized = sanitized.replace(snippet, cls.REPLACEMENT_TAG)

        # 5. Check for Phone Numbers & Spelled / Obfuscated Numbers
        phone_matches = cls.extract_phone_numbers(text)
        for clean_num, raw_segment, start_pos, end_pos in phone_matches:
            # Check if this raw segment in the original text is a safe year or Bible verse
            if cls.SAFE_YEAR_REGEX.fullmatch(raw_segment.strip()):
                continue

            categories.add(ModerationCategory.PHONE_NUMBER)
            if any(w in raw_segment.lower() for w in ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "nau", "aath", "saat", "ombhattu"]):
                categories.add(ModerationCategory.NUMBER_WORD_SEQUENCE)
            if " " in raw_segment or "." in raw_segment or "-" in raw_segment:
                categories.add(ModerationCategory.PHONE_NUMBER_OBFUSCATED)

            detected_snippets.append("phone_number")
            if raw_segment in sanitized:
                sanitized = sanitized.replace(raw_segment, cls.REPLACEMENT_TAG)
            else:
                # Find and replace the corresponding mixed/spelled tokens from original text
                replaced = False
                mixed_pattern = re.compile(
                    r"\b(?:\d+|[a-zA-Z]+)(?:[\s\-_,]+(?:\d+|[a-zA-Z]+)){4,15}\b",
                    re.IGNORECASE,
                )
                for m_match in mixed_pattern.finditer(sanitized):
                    cand = m_match.group(0)
                    exp_digits = re.sub(r"\D", "", NormalizationService.expand_number_words(cand))
                    if len(exp_digits) >= 9:
                        sanitized = sanitized.replace(cand, cls.REPLACEMENT_TAG)
                        replaced = True
                if not replaced and cls.REPLACEMENT_TAG not in sanitized:
                    sanitized = cls.REPLACEMENT_TAG

        # 6. Check for Contextual Intent Phrases
        intent_matches = list(cls.INTENT_REGEX.finditer(text))
        has_intent = len(intent_matches) > 0
        if has_intent:
            categories.add(ModerationCategory.CONTACT_SHARING_INTENT)
            for im in intent_matches:
                detected_snippets.append(f"intent: {im.group(0)}")
                # Redact intent phrases if accompanied by numbers, or redact them to preserve policy
                sanitized = sanitized.replace(im.group(0), cls.REPLACEMENT_TAG)

        is_violation = len(categories) > 0

        # Clean up double replacement tags
        clean_sanitized = re.sub(
            r"(?:\[CONTACT INFORMATION HIDDEN\]\s*)+",
            f"{cls.REPLACEMENT_TAG} ",
            sanitized,
        ).strip()

        return DetectionResult(
            is_violation=is_violation,
            categories=list(categories),
            sanitized_text=clean_sanitized,
            detected_snippets=detected_snippets,
            intent_flagged=has_intent,
            details=f"Detected: {', '.join(detected_snippets)}" if detected_snippets else None,
        )
