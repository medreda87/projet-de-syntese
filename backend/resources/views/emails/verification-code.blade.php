<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Code</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
        <tr>
            <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
                    <!-- Header -->
                    <tr>
                        <td style="background:linear-gradient(135deg,#0EA5C9,#1BB38C);padding:32px 40px;text-align:center;">
                            <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">FreshFold</h1>
                            <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Email Verification</p>
                        </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                        <td style="padding:40px;">
                            <p style="margin:0 0 16px;color:#1E2A36;font-size:16px;line-height:1.5;">Hello,</p>
                            <p style="margin:0 0 24px;color:#62707D;font-size:14px;line-height:1.6;">Use the code below to verify your email address. This code will expire in <strong style="color:#1E2A36;">5 minutes</strong>.</p>
                            
                            <!-- Code Box -->
                            <div style="background:#f4f6f8;border-radius:12px;padding:24px;text-align:center;margin:0 0 24px;">
                                <span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#0EA5C9;">{{ $code }}</span>
                            </div>

                            <p style="margin:0 0 8px;color:#62707D;font-size:13px;line-height:1.5;">If you didn't request this code, you can safely ignore this email.</p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="padding:20px 40px;border-top:1px solid #eef1f5;text-align:center;">
                            <p style="margin:0;color:#9ca3af;font-size:12px;">&copy; {{ date('Y') }} FreshFold. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
