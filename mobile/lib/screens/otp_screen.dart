import 'package:flutter/material.dart';
import '../core/network/api_client.dart';
import '../core/theme/app_theme.dart';
import '../routing/app_router.dart';
import '../widgets/custom_button.dart';

class OtpScreen extends StatefulWidget {
  final String target;
  final String otpType;
  final String? debugOtp;

  const OtpScreen({
    super.key,
    required this.target,
    this.otpType = 'REGISTRATION',
    this.debugOtp,
  });

  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen> {
  final _otpController = TextEditingController();
  final _apiClient = ApiClient();
  bool _isLoading = false;
  String? _errorMessage;

  Future<void> _handleVerify() async {
    final code = _otpController.text.trim();
    if (code.length < 4) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      await _apiClient.verifyOtp(widget.target, code, widget.otpType);
      if (mounted) {
        Navigator.of(context).pushReplacementNamed(AppRouter.profileWizard);
      }
    } catch (e) {
      if (mounted) {
        setState(() => _errorMessage = e.toString().replaceAll('Exception:', '').trim());
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Verify Mobile / Email')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Icon(Icons.mark_email_read_outlined, size: 64, color: AppTheme.primary),
            const SizedBox(height: 16),
            const Text(
              'Enter Verification Code',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppTheme.textMain),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              'We sent a 6-digit verification code to:\n${widget.target}',
              style: const TextStyle(fontSize: 14, color: AppTheme.textMuted),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),

            if (widget.debugOtp != null)
              Container(
                padding: const EdgeInsets.all(10),
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF9C3),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: const Color(0xFFCA8A04)),
                ),
                child: Text(
                  '⚡ Test Mode OTP: ${widget.debugOtp}',
                  style: const TextStyle(color: Color(0xFF854D0E), fontWeight: FontWeight.bold),
                  textAlign: TextAlign.center,
                ),
              ),

            if (_errorMessage != null)
              Container(
                padding: const EdgeInsets.all(10),
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEE2E2),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: const Color(0xFFF87171)),
                ),
                child: Text(
                  _errorMessage!,
                  style: const TextStyle(color: Color(0xFFB91C1C)),
                  textAlign: TextAlign.center,
                ),
              ),

            TextFormField(
              controller: _otpController,
              keyboardType: TextInputType.number,
              maxLength: 6,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 24, letterSpacing: 8, fontWeight: FontWeight.bold),
              decoration: const InputDecoration(
                hintText: '123456',
                border: OutlineInputBorder(),
                counterText: '',
              ),
            ),
            const SizedBox(height: 24),

            CustomButton(
              text: _isLoading ? 'Verifying...' : 'Verify & Continue',
              onPressed: _isLoading ? () {} : _handleVerify,
            ),
          ],
        ),
      ),
    );
  }
}
