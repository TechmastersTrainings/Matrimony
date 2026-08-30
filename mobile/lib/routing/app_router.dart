import 'package:flutter/material.dart';
import '../screens/chat_screen.dart';
import '../screens/discover_screen.dart';
import '../screens/home_screen.dart';
import '../screens/login_screen.dart';
import '../screens/otp_screen.dart';
import '../screens/profile_wizard_screen.dart';
import '../screens/register_screen.dart';
import '../screens/splash_screen.dart';

class AppRouter {
  static const String splash = '/';
  static const String login = '/login';
  static const String register = '/register';
  static const String otp = '/otp';
  static const String profileWizard = '/profile-wizard';
  static const String discover = '/discover';
  static const String chat = '/chat';
  static const String home = '/home';

  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case splash:
        return MaterialPageRoute(builder: (_) => const SplashScreen());
      case login:
        return MaterialPageRoute(builder: (_) => const LoginScreen());
      case register:
        return MaterialPageRoute(builder: (_) => const RegisterScreen());
      case otp:
        final args = settings.arguments as Map<String, dynamic>? ?? {};
        return MaterialPageRoute(
          builder: (_) => OtpScreen(
            target: args['target'] ?? '',
            otpType: args['type'] ?? 'REGISTRATION',
            debugOtp: args['debugOtp'],
          ),
        );
      case profileWizard:
        return MaterialPageRoute(builder: (_) => const ProfileWizardScreen());
      case discover:
        return MaterialPageRoute(builder: (_) => const DiscoverScreen());
      case chat:
        final args = settings.arguments as Map<String, dynamic>? ?? {};
        return MaterialPageRoute(
          builder: (_) => ChatScreen(
            otherUserId: args['otherUserId'],
            partnerName: args['partnerName'],
          ),
        );
      case home:
        return MaterialPageRoute(builder: (_) => const HomeScreen());
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('No route defined for ${settings.name}'),
            ),
          ),
        );
    }
  }
}
