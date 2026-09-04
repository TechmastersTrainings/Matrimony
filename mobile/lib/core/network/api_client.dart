import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/env_config.dart';

class ApiClient {
  final String baseUrl;
  static String? _accessToken;
  static String? _refreshToken;

  ApiClient({String? baseUrl}) : baseUrl = baseUrl ?? EnvConfig.apiBaseUrl;

  static void setTokens(String access, [String? refresh]) {
    _accessToken = access;
    _refreshToken = refresh;
  }

  static void clearTokens() {
    _accessToken = null;
    _refreshToken = null;
  }

  static bool get isAuthenticated => _accessToken != null;

  Map<String, String> _getHeaders() {
    final headers = <String, String>{'Content-Type': 'application/json'};
    if (_accessToken != null) {
      headers['Authorization'] = 'Bearer $_accessToken';
    }
    return headers;
  }

  Future<Map<String, dynamic>> checkHealth() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/health'),
        headers: _getHeaders(),
      );
      if (response.statusCode == 200) {
        return json.decode(response.body) as Map<String, dynamic>;
      }
      return {'status': 'unhealthy', 'message': 'HTTP ${response.statusCode}'};
    } catch (e) {
      return {'status': 'error', 'message': e.toString()};
    }
  }

  // ------------------ AUTH ------------------
  Future<Map<String, dynamic>> register(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: _getHeaders(),
      body: json.encode(data),
    );
    final resBody = json.decode(response.body);
    if (response.statusCode != 201) {
      throw Exception(resBody['error']?['message'] ?? 'Registration failed');
    }
    return resBody;
  }

  Future<Map<String, dynamic>> sendOtp(String target, [String otpType = 'REGISTRATION']) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/send-otp'),
      headers: _getHeaders(),
      body: json.encode({'target': target, 'otp_type': otpType}),
    );
    final resBody = json.decode(response.body);
    if (response.statusCode != 200) {
      throw Exception(resBody['error']?['message'] ?? 'Failed to send OTP');
    }
    return resBody;
  }

  Future<Map<String, dynamic>> verifyOtp(String target, String otpCode, [String otpType = 'REGISTRATION']) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/verify-otp'),
      headers: _getHeaders(),
      body: json.encode({'target': target, 'otp_code': otpCode, 'otp_type': otpType}),
    );
    final resBody = json.decode(response.body);
    if (response.statusCode != 200) {
      throw Exception(resBody['error']?['message'] ?? 'Invalid OTP code');
    }
    setTokens(resBody['access_token'], resBody['refresh_token']);
    return resBody;
  }

  Future<Map<String, dynamic>> login({
    required String identifier,
    String? password,
    String? otpCode,
    String loginType = 'password',
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: _getHeaders(),
      body: json.encode({
        'identifier': identifier,
        'password': password,
        'otp_code': otpCode,
        'login_type': loginType,
      }),
    );
    final resBody = json.decode(response.body);
    if (response.statusCode != 200) {
      throw Exception(resBody['error']?['message'] ?? 'Login failed');
    }
    setTokens(resBody['access_token'], resBody['refresh_token']);
    return resBody;
  }

  Future<Map<String, dynamic>> getMe() async {
    final response = await http.get(
      Uri.parse('$baseUrl/registration/me'),
      headers: _getHeaders(),
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to fetch profile details');
    }
    return json.decode(response.body);
  }

  Future<Map<String, dynamic>> saveDraft(int step, Map<String, dynamic> draftData) async {
    final response = await http.put(
      Uri.parse('$baseUrl/profile/draft'),
      headers: _getHeaders(),
      body: json.encode({'current_step': step, 'draft_data': draftData}),
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to save draft');
    }
    return json.decode(response.body);
  }

  Future<Map<String, dynamic>> submitRegistration() async {
    final response = await http.post(
      Uri.parse('$baseUrl/registration/submit'),
      headers: _getHeaders(),
      body: json.encode({'confirmed': true}),
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to submit profile');
    }
    return json.decode(response.body);
  }

  // ------------------ PHOTOS & VERIFICATION ------------------
  Future<Map<String, dynamic>> getMyPhotos() async {
    final response = await http.get(
      Uri.parse('$baseUrl/photos/my'),
      headers: _getHeaders(),
    );
    if (response.statusCode != 200) throw Exception('Failed to fetch photos');
    return json.decode(response.body);
  }

  Future<Map<String, dynamic>> getVerificationStatus() async {
    final response = await http.get(
      Uri.parse('$baseUrl/verification/status'),
      headers: _getHeaders(),
    );
    if (response.statusCode != 200) throw Exception('Failed to fetch verification status');
    return json.decode(response.body);
  }

  // ------------------ DISCOVERY & CHAT ------------------
  Future<Map<String, dynamic>> searchProfiles([Map<String, dynamic>? params]) async {
    final uri = Uri.parse('$baseUrl/discovery/search');
    final response = await http.get(uri, headers: _getHeaders());
    if (response.statusCode != 200) throw Exception('Failed to load profiles');
    return json.decode(response.body);
  }

  Future<Map<String, dynamic>> sendInterest(int targetUserId) async {
    final response = await http.post(
      Uri.parse('$baseUrl/interests/send'),
      headers: _getHeaders(),
      body: json.encode({'target_user_id': targetUserId}),
    );
    if (response.statusCode != 200) throw Exception('Failed to send interest');
    return json.decode(response.body);
  }

  Future<Map<String, dynamic>> getInterests(String tab) async {
    final response = await http.get(
      Uri.parse('$baseUrl/interests?tab=$tab'),
      headers: _getHeaders(),
    );
    if (response.statusCode != 200) throw Exception('Failed to load interests');
    return json.decode(response.body);
  }

  Future<List<dynamic>> getChatHistory(int otherUserId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/chat/$otherUserId'),
      headers: _getHeaders(),
    );
    if (response.statusCode != 200) throw Exception('Failed to get chat messages');
    return (json.decode(response.body))['messages'] as List<dynamic>;
  }

  Future<Map<String, dynamic>> sendMessage(int otherUserId, String text) async {
    final response = await http.post(
      Uri.parse('$baseUrl/chat/$otherUserId'),
      headers: _getHeaders(),
      body: json.encode({'message_text': text}),
    );
    if (response.statusCode != 200) throw Exception('Failed to send message');
    return json.decode(response.body);
  }
}
