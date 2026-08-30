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
      final response = await http
          .get(Uri.parse('$baseUrl/health'))
          .timeout(const Duration(seconds: 5));

      if (response.statusCode == 200 || response.statusCode == 503) {
        return json.decode(response.body) as Map<String, dynamic>;
      }
      return {'status': 'degraded', 'message': 'HTTP ${response.statusCode}'};
    } catch (e) {
      return {'status': 'offline', 'message': e.toString()};
    }
  }

  Future<Map<String, dynamic>> register(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: _getHeaders(),
      body: json.encode(data),
    );
    final resBody = json.decode(response.body);
    if (response.statusCode != 201) {
      throw Exception(resBody['error']?['message'] ?? resBody['detail'] ?? 'Registration failed');
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
}
