import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/env_config.dart';

class ApiClient {
  final String baseUrl;

  ApiClient({String? baseUrl}) : baseUrl = baseUrl ?? EnvConfig.apiBaseUrl;

  Future<Map<String, dynamic>> checkHealth() async {
    try {
      final response = await http
          .get(Uri.parse('$baseUrl/health'))
          .timeout(const Duration(seconds: 5));

      if (response.statusCode == 200 || response.statusCode == 503) {
        return json.decode(response.body) as Map<String, dynamic>;
      }
      return {
        'status': 'degraded',
        'message': 'HTTP ${response.statusCode}',
      };
    } catch (e) {
      return {
        'status': 'offline',
        'message': e.toString(),
      };
    }
  }
}
