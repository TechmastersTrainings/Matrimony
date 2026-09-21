import re
import unicodedata
from typing import Dict, List, Tuple


class NormalizationService:
    # Zero-width & invisible characters to strip
    ZERO_WIDTH_CHARS = re.compile(r"[\u200B-\u200D\uFEFF\u00AD\u2060\u180E]")

    # Leetspeak translation table (character to letter/digit)
    LEET_MAP: Dict[str, str] = {
        "@": "a",
        "$": "s",
        "!": "i",
        "|": "i",
        "0": "o",
        "1": "i",
        "3": "e",
        "4": "a",
        "5": "s",
        "7": "t",
        "8": "b",
        "+": "t",
    }

    # Number words mapping across English, Hindi/Hinglish, and Kannada
    NUMBER_WORD_MAP: Dict[str, str] = {
        # English
        "zero": "0",
        "oh": "0",
        "one": "1",
        "two": "2",
        "three": "3",
        "four": "4",
        "five": "5",
        "six": "6",
        "seven": "7",
        "eight": "8",
        "nine": "9",
        # Hindi / Hinglish
        "shunya": "0",
        "sunya": "0",
        "ek": "1",
        "do": "2",
        "teen": "3",
        "tin": "3",
        "chaar": "4",
        "char": "4",
        "paanch": "5",
        "panch": "5",
        "chhe": "6",
        "che": "6",
        "chhey": "6",
        "saat": "7",
        "sat": "7",
        "aath": "8",
        "ath": "8",
        "nau": "9",
        # Kannada (Latin script transliterations)
        "sonne": "0",
        "ondu": "1",
        "eradu": "2",
        "mooru": "3",
        "muru": "3",
        "naalku": "4",
        "nalku": "4",
        "aidu": "5",
        "aydu": "5",
        "aaru": "6",
        "aru": "6",
        "elu": "7",
        "yelu": "7",
        "entu": "8",
        "yentu": "8",
        "ombhattu": "9",
        "ombattu": "9",
    }

    # Common multiplier prefixes
    MULTIPLIERS = {
        "double": 2,
        "triple": 3,
        "pair": 2,
        "two times": 2,
        "three times": 3,
    }

    @classmethod
    def clean_unicode(cls, text: str) -> str:
        """Normalizes Unicode representation (NFKC) and removes hidden/zero-width chars."""
        if not text:
            return ""
        # NFKC converts ligatures, compatibility characters, and full-width forms
        normalized = unicodedata.normalize("NFKC", text)
        # Strip zero-width and invisible characters
        cleaned = cls.ZERO_WIDTH_CHARS.sub("", normalized)
        return cleaned

    @classmethod
    def expand_number_words(cls, text: str) -> str:
        """Translates spelled-out number words (including double/triple multipliers) to numeric digits."""
        if not text:
            return ""

        lower = text.lower()

        # 1. Expand multipliers: e.g. "double eight" -> "eight eight", "triple two" -> "two two two"
        for mult_word, count in cls.MULTIPLIERS.items():
            pattern = re.compile(r"\b" + re.escape(mult_word) + r"[\s\-_]+([a-z0-9]+)\b", re.IGNORECASE)

            def _replace_mult(match):
                target = match.group(1).lower()
                if target in cls.NUMBER_WORD_MAP or target.isdigit():
                    return " ".join([target] * count)
                return match.group(0)

            lower = pattern.sub(_replace_mult, lower)

        # 2. Replace standalone number words with digits
        tokens = re.split(r"(\W+)", lower)
        result_tokens = []
        for token in tokens:
            cleaned_token = token.lower().strip("-_.,")
            if cleaned_token in cls.NUMBER_WORD_MAP:
                result_tokens.append(cls.NUMBER_WORD_MAP[cleaned_token])
            else:
                result_tokens.append(token)

        return "".join(result_tokens)

    @classmethod
    def normalize_for_detection(cls, text: str) -> str:
        """Produces canonical detection-ready text with normalized spaces, digits, and words."""
        cleaned = cls.clean_unicode(text)
        expanded = cls.expand_number_words(cleaned)
        return expanded
