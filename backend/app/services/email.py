import asyncio
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
from typing import Any, Dict, Optional

from backend.app.core.config import settings
from backend.app.core.logger import logger


class EmailService:
    @staticmethod
    def _send_smtp_sync(to_email: str, subject: str, html_body: str, text_body: Optional[str] = None) -> bool:
        """Sends an email synchronously via SMTP (runs in background thread)."""
        if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
            logger.warning(f"SMTP not configured. Skipping email to {to_email}")
            return False

        try:
            msg = MIMEMultipart("alternative")
            from_name = getattr(settings, "SMTP_FROM_NAME", "Christian Matrimony")
            from_addr = getattr(settings, "SMTP_FROM_EMAIL", settings.SMTP_USER)
            msg["From"] = f"{from_name} <{from_addr}>"
            msg["To"] = to_email
            msg["Subject"] = subject

            # Plain text fallback
            plain_text = text_body or "Your Christian Matrimony notification."
            msg.attach(MIMEText(plain_text, "plain"))

            # HTML content
            msg.attach(MIMEText(html_body, "html"))

            server = smtplib.SMTP(settings.SMTP_HOST or "smtp.gmail.com", settings.SMTP_PORT or 587, timeout=20)
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(from_addr, [to_email], msg.as_string())
            server.quit()

            logger.info(f"Email successfully sent to {to_email} with subject: '{subject}'")
            return True
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {e}")
            return False

    @classmethod
    async def send_email(
        cls,
        to_email: str,
        subject: str,
        html_body: str,
        text_body: Optional[str] = None,
    ) -> bool:
        """Asynchronously dispatches an email via worker thread."""
        return await asyncio.to_thread(cls._send_smtp_sync, to_email, subject, html_body, text_body)

    @classmethod
    async def send_profile_approved_email(
        cls,
        to_email: str,
        candidate_name: str,
        profile_id: int,
    ) -> bool:
        """Sends rich celebration email when admin approves candidate's matrimonial profile."""
        subject = "✝️ Congratulations! Your Christian Matrimony Profile is Verified & Approved"

        html_body = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{subject}</title>
  <style>
    body {{
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #020617;
      margin: 0;
      padding: 20px;
      color: #0f172a;
    }}
    .wrapper {{
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 15px 30px rgba(0,0,0,0.3);
    }}
    .header {{
      background: linear-gradient(135deg, #091124 0%, #0f172a 100%);
      padding: 36px 30px;
      text-align: center;
      border-bottom: 3px solid #f59e0b;
    }}
    .cross-icon {{
      display: inline-block;
      font-size: 32px;
      margin-bottom: 8px;
    }}
    .brand-title {{
      color: #ffffff;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: 0.5px;
      margin: 0;
    }}
    .brand-sub {{
      color: #f59e0b;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: 700;
      margin-top: 6px;
    }}
    .content {{
      padding: 36px 32px;
      background-color: #ffffff;
      line-height: 1.6;
    }}
    .badge {{
      display: inline-block;
      background-color: #ecfdf5;
      color: #059669;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 800;
      border: 1px solid #a7f3d0;
      margin-bottom: 16px;
    }}
    h2 {{
      color: #0f172a;
      font-size: 24px;
      margin-top: 0;
      margin-bottom: 14px;
      font-weight: 800;
    }}
    p {{
      color: #475569;
      font-size: 14px;
      margin-bottom: 16px;
    }}
    .card {{
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #f59e0b;
      border-radius: 12px;
      padding: 18px 20px;
      margin: 24px 0;
    }}
    .card-item {{
      font-size: 13px;
      color: #334155;
      margin: 6px 0;
    }}
    .card-item strong {{
      color: #0f172a;
    }}
    .cta-container {{
      text-align: center;
      margin: 32px 0 20px 0;
    }}
    .cta-button {{
      display: inline-block;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: #020617 !important;
      text-decoration: none;
      font-weight: 800;
      font-size: 14px;
      padding: 14px 34px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);
    }}
    .scripture {{
      font-style: italic;
      color: #64748b;
      font-size: 12px;
      text-align: center;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px dashed #e2e8f0;
    }}
    .footer {{
      background-color: #0f172a;
      color: #94a3b8;
      padding: 24px 30px;
      text-align: center;
      font-size: 11px;
    }}
    .footer p {{
      color: #94a3b8;
      margin: 4px 0;
      font-size: 11px;
    }}
    .footer-highlight {{
      color: #f59e0b;
      font-weight: 700;
    }}
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="cross-icon">✝️</div>
      <h1 class="brand-title">Christian Matrimony</h1>
      <div class="brand-sub">A Techmasters Innovations Product</div>
    </div>

    <div class="content">
      <div class="badge">✓ Pastoral & Admin Verified</div>
      <h2>Praise God, {candidate_name}!</h2>
      <p>
        We are thrilled to inform you that your matrimonial profile has been carefully reviewed, verified, and officially <strong>APPROVED</strong> by our moderation team.
      </p>

      <div class="card">
        <div class="card-item"><strong>Candidate Name:</strong> {candidate_name}</div>
        <div class="card-item"><strong>Profile Reference:</strong> CM-{profile_id}</div>
        <div class="card-item"><strong>Status:</strong> <span style="color:#059669; font-weight:700;">APPROVED & ACTIVE</span></div>
        <div class="card-item"><strong>Verification Badge:</strong> Genuine Christian Fellowship Verified</div>
      </div>

      <p>
        <strong>What this means for you:</strong>
      </p>
      <ul style="color: #475569; font-size: 13px; padding-left: 20px; line-height: 1.8;">
        <li>Your profile is now discoverable by verified Christian brides & grooms across Bidar, Karnataka, and Pan-India.</li>
        <li>You can browse profiles, bookmark candidates, and express matrimonial interest.</li>
        <li>Your contact details remain confidential and protected under our controlled reveal policy.</li>
      </ul>

      <div class="cta-container">
        <a href="http://localhost:3000/login" class="cta-button">
          Sign In & Explore Matches →
        </a>
      </div>

      <div class="scripture">
        &ldquo;Therefore what God has joined together, let no one separate.&rdquo; — Mark 10:9
      </div>
    </div>

    <div class="footer">
      <p>With prayers and blessings,</p>
      <p class="footer-highlight">Christian Matrimony Team • Techmasters Innovations</p>
      <p style="margin-top: 12px; color: #64748b;">
        This is an automated notification regarding your account at Christian Matrimony.
      </p>
    </div>
  </div>
</body>
</html>"""

        plain_text = f"""Praise God, {candidate_name}!

Your matrimonial profile (Reference: CM-{profile_id}) has been reviewed, verified, and officially APPROVED by our administration team.

Your profile is now live and discoverable by verified Christian brides and grooms.

Log in to start exploring matches:
http://localhost:3000/login

With blessings,
Christian Matrimony Team (A Techmasters Innovations Product)
"""

        return await cls.send_email(to_email, subject, html_body, plain_text)

    @classmethod
    async def send_profile_rejected_email(
        cls,
        to_email: str,
        candidate_name: str,
        reason: str,
    ) -> bool:
        """Sends moderation update email when profile is rejected."""
        subject = "Christian Matrimony: Update regarding your profile submission"
        html_body = f"""<div style="font-family:sans-serif; max-width:600px; margin:auto; padding:20px;">
          <h2 style="color:#b91c1c;">Profile Moderation Update</h2>
          <p>Dear {candidate_name},</p>
          <p>Thank you for submitting your profile on Christian Matrimony. Our moderation team has reviewed your submission and noted the following reason for rejection:</p>
          <div style="background:#fef2f2; border-left:4px solid #ef4444; padding:15px; margin:20px 0; color:#991b1b;">
            {reason}
          </div>
          <p>You can update your profile details and resubmit for verification anytime.</p>
          <p style="margin-top:30px; font-size:12px; color:#6b7280;">Christian Matrimony • Techmasters Innovations</p>
        </div>"""
        plain_text = f"Dear {candidate_name},\n\nYour profile submission requires review:\nReason: {reason}\n\nChristian Matrimony Team"
        return await cls.send_email(to_email, subject, html_body, plain_text)

    @classmethod
    async def send_profile_changes_requested_email(
        cls,
        to_email: str,
        candidate_name: str,
        notes: str,
    ) -> bool:
        """Sends moderation update email when changes are requested."""
        subject = "Christian Matrimony: Changes requested for your profile"
        html_body = f"""<div style="font-family:sans-serif; max-width:600px; margin:auto; padding:20px;">
          <h2 style="color:#d97706;">Changes Requested for Your Profile</h2>
          <p>Dear {candidate_name},</p>
          <p>Our moderation team needs a few updates before your profile can be approved:</p>
          <div style="background:#fffbeb; border-left:4px solid #f59e0b; padding:15px; margin:20px 0; color:#92400e;">
            {notes}
          </div>
          <p>Please sign in at <a href="http://localhost:3000/login">http://localhost:3000/login</a> to update your profile.</p>
          <p style="margin-top:30px; font-size:12px; color:#6b7280;">Christian Matrimony • Techmasters Innovations</p>
        </div>"""
        plain_text = f"Dear {candidate_name},\n\nChanges requested:\n{notes}\n\nPlease sign in to update: http://localhost:3000/login\n\nChristian Matrimony Team"
    @classmethod
    async def send_otp_email(
        cls,
        to_email: str,
        otp_code: str,
        purpose: str = "Account Verification",
    ) -> bool:
        """Sends OTP verification email via SMTP."""
        subject = f"✝️ Your Christian Matrimony OTP Code is {otp_code}"
        html_body = f"""<div style="font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width:520px; margin:auto; padding:24px; border:1px solid #e2e8f0; border-radius:16px; background:#ffffff; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
          <div style="text-align:center; padding-bottom:16px; border-bottom:1px solid #f1f5f9;">
            <div style="font-size:28px;">✝️</div>
            <h2 style="color:#0f172a; margin:4px 0 0 0; font-size:20px;">Christian Matrimony</h2>
            <p style="color:#64748b; font-size:11px; margin:2px 0 0 0; text-transform:uppercase; letter-spacing:1px;">A Techmasters Innovations Product</p>
          </div>
          <div style="padding:24px 0; text-align:center;">
            <h3 style="color:#0f172a; font-size:18px; margin-top:0;">Your Verification Code</h3>
            <p style="color:#475569; font-size:13px; line-height:1.5;">Use the following 6-digit one-time password to complete your {purpose}:</p>
            <div style="background:#f8fafc; border:2px dashed #f59e0b; border-radius:12px; padding:16px; margin:20px 0; font-size:32px; font-weight:800; letter-spacing:8px; color:#0f172a;">
              {otp_code}
            </div>
            <p style="color:#94a3b8; font-size:12px;">This code expires in 10 minutes. For security, never share this code with anyone.</p>
          </div>
          <div style="border-top:1px solid #f1f5f9; padding-top:16px; text-align:center; color:#94a3b8; font-size:11px;">
            If you did not request this OTP code, you can safely ignore this email.
          </div>
        </div>"""
        plain_text = f"Your Christian Matrimony verification code is: {otp_code}. Valid for 10 minutes."
        return await cls.send_email(to_email, subject, html_body, plain_text)


_email_service_instance = EmailService()


def get_email_service() -> EmailService:
    return _email_service_instance
