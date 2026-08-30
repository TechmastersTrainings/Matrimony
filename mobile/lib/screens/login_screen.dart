import 'package:flutter/material.dart';
import '../core/network/api_client.dart';
import '../core/theme/app_theme.dart';
import '../routing/app_router.dart';
import '../widgets/custom_button.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final _identifierController = TextEditingController();
  final _passwordController = TextEditingController();
  final _otpController = TextEditingController();
  final _apiClient = ApiClient();

  bool _isLoading = false;
  bool _otpSent = false;
  String? _debugOtp;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  Future<void> _handlePasswordLogin() async {
    if (_identifierController.text.isEmpty || _passwordController.text.isEmpty) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      await _apiClient.login(
        identifier: _identifierController.text.trim(),
        password: _passwordController.text,
        loginType: 'password',
      );
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

  Future<void> _handleSendOtp() async {
    if (_identifierController.text.isEmpty) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final res = await _apiClient.sendOtp(_identifierController.text.trim(), 'LOGIN');
      if (mounted) {
        setState(() {
          _otpSent = true;
          _debugOtp = res['debug_otp'];
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _errorMessage = e.toString().replaceAll('Exception:', '').trim());
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _handleOtpLogin() async {
    if (_identifierController.text.isEmpty || _otpController.text.isEmpty) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      await _apiClient.login(
        identifier: _identifierController.text.trim(),
        otpCode: _otpController.text.trim(),
        loginType: 'otp',
      );
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
      appBar: AppBar(title: const Text('Login')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Welcome Back',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.textMain),
            ),
            const SizedBox(height: 6),
            const Text(
              'Sign in to your Christian Matrimony account',
              style: TextStyle(fontSize: 14, color: AppTheme.textMuted),
            ),
            const SizedBox(height: 20),

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
                ),
              ),

            if (_debugOtp != null)
              Container(
                padding: const EdgeInsets.all(10),
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF9C3),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: const Color(0xFFCA8A04)),
                ),
                child: Text(
                  '⚡ Test Mode OTP: $_debugOtp',
                  style: const TextStyle(color: Color(0xFF854D0E), fontWeight: FontWeight.bold),
                ),
              ),

            TabBar(
              controller: _tabController,
              labelColor: AppTheme.primary,
              indicatorColor: AppTheme.primary,
              tabs: const [
                Tab(text: 'Password Login'),
                Tab(text: 'OTP Login'),
              ],
            ),
            const SizedBox(height: 20),

            TextFormField(
              controller: _identifierController,
              decoration: const InputDecoration(
                labelText: 'Mobile Number or Email',
                border: OutlineInputBorder(),
                hintText: '9876543210 or email@domain.com',
              ),
            ),
            const SizedBox(height: 16),

            SizedBox(
              height: 200,
              child: TabBarView(
                controller: _tabController,
                children: [
                  // Password Tab
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      TextFormField(
                        controller: _passwordController,
                        obscureText: true,
                        decoration: const InputDecoration(
                          labelText: 'Password',
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 20),
                      CustomButton(
                        text: _isLoading ? 'Signing in...' : 'Sign In',
                        onPressed: _isLoading ? () {} : _handlePasswordLogin,
                      ),
                    ],
                  ),

                  // OTP Tab
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _otpController,
                              keyboardType: TextInputType.number,
                              maxLength: 6,
                              decoration: const InputDecoration(
                                labelText: '6-Digit OTP',
                                border: OutlineInputBorder(),
                                counterText: '',
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.primaryLight,
                              foregroundColor: AppTheme.primary,
                            ),
                            onPressed: _isLoading ? null : _handleSendOtp,
                            child: Text(_otpSent ? 'Resend' : 'Send OTP'),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      CustomButton(
                        text: _isLoading ? 'Verifying...' : 'Sign In with OTP',
                        onPressed: _isLoading ? () {} : _handleOtpLogin,
                      ),
                    ],
                  ),
                ],
              ),
            ),

            Center(
              child: TextButton(
                onPressed: () => Navigator.of(context).pushReplacementNamed(AppRouter.register),
                child: const Text('Don\'t have an account? Register Free'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
