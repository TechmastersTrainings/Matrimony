import 'package:flutter/material.dart';
import '../core/network/api_client.dart';
import '../core/theme/app_theme.dart';
import '../widgets/custom_button.dart';

class ProfileWizardScreen extends StatefulWidget {
  const ProfileWizardScreen({super.key});

  @override
  State<ProfileWizardScreen> createState() => _ProfileWizardScreenState();
}

class _ProfileWizardScreenState extends State<ProfileWizardScreen> {
  final _apiClient = ApiClient();
  int _currentStep = 1;
  bool _isLoading = true;
  bool _isSaving = false;
  bool _isSubmitted = false;
  String? _message;

  final Map<String, dynamic> _formData = {
    'denomination': 'METHODIST',
    'church_name': 'Centenary Methodist Church',
    'highest_education': 'B.Tech',
    'occupation_title': 'Software Engineer',
    'state': 'Karnataka',
    'district': 'Bidar',
  };

  @override
  void initState() {
    super.initState();
    _loadProfileData();
  }

  Future<void> _loadProfileData() async {
    try {
      final me = await _apiClient.getMe();
      if (me['profile_status'] == 'SUBMITTED') {
        setState(() => _isSubmitted = true);
      }
      if (me['draft'] != null && me['draft']['draft_data'] != null) {
        _formData.addAll(me['draft']['draft_data'] as Map<String, dynamic>);
        _currentStep = me['draft']['current_step'] ?? 1;
      }
    } catch (e) {
      // Offline / not logged in
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _saveDraft(int step, [bool showToast = true]) async {
    setState(() => _isSaving = true);
    try {
      await _apiClient.saveDraft(step, _formData);
      if (showToast && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('✓ Draft saved. You can resume anytime!')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to save draft: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  Future<void> _submitProfile() async {
    setState(() => _isSaving = true);
    try {
      await _apiClient.saveDraft(6, _formData);
      await _apiClient.submitRegistration();
      if (mounted) setState(() => _isSubmitted = true);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to submit profile: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (_isSubmitted) {
      return Scaffold(
        appBar: AppBar(title: const Text('Profile Status')),
        body: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Icon(Icons.check_circle_outline, size: 72, color: Colors.green),
              const SizedBox(height: 20),
              const Text(
                'Profile Submitted Successfully!',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              const Text(
                'Your matrimonial registration for Bidar, Karnataka is submitted and queued for Phase 4 verification & photos.',
                style: TextStyle(color: AppTheme.textMuted, fontSize: 14),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),
              CustomButton(
                text: 'Back to Home',
                onPressed: () => Navigator.of(context).pushReplacementNamed('/home'),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('Profile Wizard (Step $_currentStep of 6)'),
        actions: [
          TextButton.icon(
            onPressed: _isSaving ? null : () => _saveDraft(_currentStep, true),
            icon: const Icon(Icons.save_outlined, color: AppTheme.primary, size: 18),
            label: Text(_isSaving ? 'Saving...' : 'Save Draft', style: const TextStyle(color: AppTheme.primary)),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            LinearProgressIndicator(
              value: _currentStep / 6,
              backgroundColor: const Color(0xFFE7E5E4),
              color: AppTheme.primary,
            ),
            const SizedBox(height: 24),

            if (_currentStep == 1) ...[
              const Text('Step 1: Basic & Personal Information', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              TextFormField(
                initialValue: _formData['dob'] ?? '1998-05-15',
                decoration: const InputDecoration(labelText: 'Date of Birth (YYYY-MM-DD)', border: OutlineInputBorder()),
                onChanged: (v) => _formData['dob'] = v,
              ),
              const SizedBox(height: 16),
              TextFormField(
                initialValue: (_formData['height_cm'] ?? 175).toString(),
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Height (cm)', border: OutlineInputBorder()),
                onChanged: (v) => _formData['height_cm'] = int.tryParse(v) ?? 170,
              ),
            ] else if (_currentStep == 2) ...[
              const Text('Step 2: Christian Faith & Church', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _formData['denomination'] ?? 'METHODIST',
                decoration: const InputDecoration(labelText: 'Denomination', border: OutlineInputBorder()),
                items: const [
                  DropdownMenuItem(value: 'METHODIST', child: Text('Methodist')),
                  DropdownMenuItem(value: 'CSI', child: Text('CSI')),
                  DropdownMenuItem(value: 'CATHOLIC', child: Text('Roman Catholic')),
                  DropdownMenuItem(value: 'BAPTIST', child: Text('Baptist')),
                  DropdownMenuItem(value: 'PENTECOSTAL', child: Text('Pentecostal')),
                ],
                onChanged: (v) => _formData['denomination'] = v,
              ),
              const SizedBox(height: 16),
              TextFormField(
                initialValue: _formData['church_name'] ?? 'Centenary Methodist Church',
                decoration: const InputDecoration(labelText: 'Church / Parish Name', border: OutlineInputBorder()),
                onChanged: (v) => _formData['church_name'] = v,
              ),
            ] else ...[
              Text('Step $_currentStep: Additional Matrimonial Information', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              TextFormField(
                initialValue: _formData['occupation_title'] ?? 'Software Engineer',
                decoration: const InputDecoration(labelText: 'Profession / Job Title', border: OutlineInputBorder()),
                onChanged: (v) => _formData['occupation_title'] = v,
              ),
              const SizedBox(height: 16),
              TextFormField(
                initialValue: _formData['highest_education'] ?? 'B.Tech',
                decoration: const InputDecoration(labelText: 'Education Degree', border: OutlineInputBorder()),
                onChanged: (v) => _formData['highest_education'] = v,
              ),
            ],

            const SizedBox(height: 32),
            Row(
              children: [
                if (_currentStep > 1)
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => setState(() => _currentStep--),
                      child: const Text('Back'),
                    ),
                  ),
                if (_currentStep > 1) const SizedBox(width: 12),
                Expanded(
                  child: CustomButton(
                    text: _currentStep < 6 ? 'Next Step →' : 'Submit Profile',
                    onPressed: _currentStep < 6
                        ? () {
                            _saveDraft(_currentStep + 1, false);
                            setState(() => _currentStep++);
                          }
                        : _submitProfile,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
