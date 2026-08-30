// Placeholder for Mobile Services in future phases
import '../core/network/api_client.dart';

class SystemMobileService {
  final ApiClient apiClient;

  SystemMobileService({ApiClient? client}) : apiClient = client ?? ApiClient();

  Future<Map<String, dynamic>> getHealth() async {
    return await apiClient.checkHealth();
  }
}
