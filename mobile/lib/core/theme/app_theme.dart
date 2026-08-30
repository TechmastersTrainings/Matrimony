import 'package:flutter/material.dart';

class AppTheme {
  static const Color primary = Color(0xFF9B2C2C);
  static const Color primaryLight = Color(0xFFFFF5F5);
  static const Color accent = Color(0xFFD69E2E);
  static const Color background = Color(0xFFFAFAF9);
  static const Color cardBg = Color(0xFFFFFFFF);
  static const Color textMain = Color(0xFF1C1917);
  static const Color textMuted = Color(0xFF78716C);

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: background,
      primaryColor: primary,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primary,
        primary: primary,
        secondary: accent,
        surface: cardBg,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        foregroundColor: primary,
        elevation: 0.5,
        centerTitle: true,
      ),
    );
  }
}
