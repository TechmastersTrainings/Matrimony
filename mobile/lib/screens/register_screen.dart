import 'package:flutter/material.dart';
import '../core/network/api_client.dart';
import '../core/theme/app_theme.dart';
import '../routing/app_router.dart';
import '../widgets/custom_button.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _apiClient = ApiClient();

  String _profileCreatedBy = 'SELF';
  String _gender = 'MALE';
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _mobileController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _isLoading = false;
  String? _errorMessage;

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final res = await _apiClient.register({
        'profile_created_by': _profileCreatedBy,
        'role': _profileCreatedBy == 'SELF' ? 'CANDIDATE' : 'MANAGER',
        'first_name': _firstNameController.text.trim(),
        'last_name': _lastNameController.text.trim(),
        'gender': _gender,
        'mobile_number': _mobileController.text.trim(),
        'email': _emailController.text.trim(),
        'password': _passwordController.text.isNotEmpty ? _passwordController.text : null,
      });

      if (mounted) {
        Navigator.of(context).pushNamed(
          AppRouter.otp,
          arguments: {
            'target': _mobileController.text.trim(),
            'type': 'REGISTRATION',
            'debugOtp': res['debug_otp'],
          },
        );
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
      appBar: AppBar(
        title: const Text('Create Account'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Join Bidar Christian Matrimony',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppTheme.textMain),
              ),
              const SizedBox(height: 6),
              const Text(
                'Register your profile to begin your matchmaking journey.',
                style: TextStyle(fontSize: 14, color: AppTheme.textMuted),
              ),
              const SizedBox(height: 20),

              if (_errorMessage != null)
                Container(
                  padding: const EdgeInsets.all(12),
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFEE2E2),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: const Color(0xFFF87171)),
                  ),
                  child: Text(
                    _errorMessage!,
                    style: const TextStyle(color: Color(0xFFB91C1C), fontSize: 13),
                  ),
                ),

              // Profile Created By
              DropdownButtonFormField<String>(
                value: _profileCreatedBy,
                decoration: const InputDecoration(
                  labelText: 'Profile Created By',
                  border: OutlineInputBorder(),
                ),
                items: const [
                  DropdownMenuItem(value: 'SELF', child: Text('Self (Candidate)')),
                  DropdownMenuItem(value: 'PARENT', child: Text('Parent')),
                  DropdownMenuItem(value: 'SIBLING', child: Text('Sibling')),
                  DropdownMenuItem(value: 'RELATIVE', child: Text('Relative')),
                  DropdownMenuItem(value: 'FRIEND', child: Text('Friend')),
                ],
                onChanged: (val) => setState(() => _profileCreatedBy = val ?? 'SELF'),
              ),
              const SizedBox(height: 16),

              // Names
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _firstNameController,
                      decoration: const InputDecoration(labelText: 'First Name', border: OutlineInputBorder()),
                      validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: TextFormField(
                      controller: _lastNameController,
                      decoration: const InputDecoration(labelText: 'Last Name', border: OutlineInputBorder()),
                      validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Gender
              Row(
                children: [
                  const Text('Gender: ', style: TextStyle(fontWeight: FontWeight.w600)),
                  Radio<String>(
                    value: 'MALE',
                    groupValue: _gender,
                    onChanged: (v) => setState(() => _gender = v!),
                  ),
                  const Text('Groom (Male)'),
                  Radio<String>(
                    value: 'FEMALE',
                    groupValue: _gender,
                    onChanged: (v) => setState(() => _gender = v!),
                  ),
                  const Text('Bride (Female)'),
                ],
              ),
              const SizedBox(height: 12),

              TextFormField(
                controller: _mobileController,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(labelText: 'Mobile Number', border: OutlineInputBorder(), hintText: '9876543210'),
                validator: (v) => (v == null || v.length < 10) ? 'Enter valid 10-digit number' : null,
              ),
              const SizedBox(height: 16),

              TextFormField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: const InputDecoration(labelText: 'Email Address', border: OutlineInputBorder(), hintText: 'user@example.com'),
                validator: (v) => (v == null || !v.contains('@')) ? 'Enter valid email' : null,
              ),
              const SizedBox(height: 16),

              TextFormField(
                controller: _passwordController,
                obscureText: true,
                decoration: const InputDecoration(labelText: 'Password (Optional)', border: OutlineInputBorder()),
              ),
              const SizedBox(height: 24),

              CustomButton(
                text: _isLoading ? 'Sending OTP...' : 'Register & Verify OTP',
                onPressed: _isLoading ? () {} : _handleRegister,
              ),
              const SizedBox(height: 16),

              Center(
                child: TextButton(
                  onPressed: () => Navigator.of(context).pushReplacementNamed(AppRouter.login),
                  child: const Text('Already have an account? Login here'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
