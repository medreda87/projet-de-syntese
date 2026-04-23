<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f6f8; margin: 0; padding: 40px 0; }
    .card { background: #fff; border-radius: 16px; max-width: 520px; margin: 0 auto; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,.07); }
    .logo { font-size: 24px; font-weight: 800; color: #0C8CE9; margin-bottom: 24px; }
    .badge { display: inline-block; background: #f0fdf4; color: #22c55e; font-size: 13px; font-weight: 700; padding: 6px 14px; border-radius: 99px; margin-bottom: 20px; }
    h1 { font-size: 22px; font-weight: 800; color: #0F172A; margin: 0 0 12px; }
    p { font-size: 15px; color: #475569; line-height: 1.6; margin: 0 0 16px; }
    .shop { background: #f8fafc; border-radius: 12px; padding: 16px 20px; margin: 20px 0; }
    .shop strong { font-size: 17px; color: #0F172A; }
    .cta { display: inline-block; background: linear-gradient(135deg, #0C8CE9, #06D6A0); color: #fff; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 12px; text-decoration: none; margin: 8px 0 24px; }
    .footer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">Mesbanati</div>
    <div class="badge">✅ Approved</div>
    <h1>Congratulations, {{ $laundry->user->name ?? 'Provider' }}!</h1>
    <p>We're thrilled to let you know that your laundry listing has been <strong>approved</strong> and is now live on the Mesbanati platform.</p>
    <div class="shop">
      <strong>{{ $laundry->name }}</strong><br>
      <span style="color:#64748b;font-size:14px;">{{ $laundry->address }}</span>
    </div>
    <p>Customers can now find and book your services. Keep your profile up to date for the best visibility.</p>
    <a href="https://mesbanati.ma/dashboard" class="cta">Go to your Dashboard</a>
    <p>Welcome to the Mesbanati family 🎉</p>
    <div class="footer">© {{ date('Y') }} Mesbanati. All rights reserved.</div>
  </div>
</body>
</html>
