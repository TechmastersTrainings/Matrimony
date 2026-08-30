// Placeholder for Mobile Models in future phases
class ServiceHealthModel {
  final String status;
  final String message;

  ServiceHealthModel({required this.status, required this.message});

  factory ServiceHealthModel.fromJson(Map<String, dynamic> json) {
    return ServiceHealthModel(
      status: json['status'] ?? 'unknown',
      message: json['message'] ?? '',
    );
  }
}
