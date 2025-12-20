const welcomeEmail = ( userName, planName = "Nawaya Early Access", email ) => {
    // Brand Colors
    const primaryGreen = "#1a4731"; // Deep Forest Green
    const accentGreen = "#e8f5e9";  // Soft Mint Green
    
    return `
      <!DOCTYPE html>
      <html> 
        <head>
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f7;
              color: #333333;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            .header {
              background-color: ${primaryGreen};
              text-align: center;
              padding: 40px 0;
              color: #ffffff;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              letter-spacing: 2px;
              font-weight: bold;
            }
            .content {
              padding: 40px;
              text-align: center;
            }
            .welcome-badge {
              display: inline-block;
              padding: 8px 16px;
              background-color: ${accentGreen};
              color: ${primaryGreen};
              border-radius: 20px;
              font-weight: bold;
              font-size: 14px;
              margin-bottom: 20px;
            }
            .content h2 {
              font-size: 22px;
              color: ${primaryGreen};
              margin-bottom: 15px;
            }
            .content p {
              font-size: 16px;
              color: #555555;
              line-height: 1.6;
              margin-bottom: 25px;
            }
            .plan-card {
              background-color: #f9fdfa;
              border: 1px solid #d0e7d2;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .plan-name {
              font-size: 20px;
              font-weight: bold;
              color: ${primaryGreen};
              text-transform: uppercase;
            }
            .button {
              display: inline-block;
              padding: 15px 30px;
              background-color: ${primaryGreen};
              color: #ffffff !important;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              margin-top: 10px;
            }
            .credentials-box {
              margin-top: 30px;
              padding: 20px;
              background-color: #f8f9fa;
              border-radius: 8px;
              border-left: 4px solid ${primaryGreen};
              text-align: left;
            }
            .footer {
              background-color: #f4f4f7;
              text-align: center;
              color: #888888;
              padding: 20px;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
               <h1>NAWAYA</h1>
            </div>
            <div class="content">
              <div class="welcome-badge">MEMBER STATUS: ACTIVE</div>
              <h2>Welcome to the Premium Club, ${userName}!</h2>
              <p>
                Great news! Your subscription has been confirmed. You now have full access to all our professional tools and priority features.
              </p>
              
              <div class="plan-card">
                <span style="font-size: 12px; color: #666;">YOUR CURRENT PLAN</span><br/>
                <span class="plan-name">${planName}</span>
              </div>

              <p>Ready to get started? Dive back into your dashboard and explore your new capabilities.</p>
              
              <a href="${process.env.CLIENT_URI}/login" class="button">Go to Dashboard</a>

              <div class="credentials-box">
                <span style="font-size: 12px; font-weight: bold; color: ${primaryGreen};">YOUR ACCOUNT CREDENTIALS</span>
                <p style="margin: 10px 0 5px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 0;"><strong>Access Key:</strong> ${process.env.PASSWORD}</p>
              </div>
            </div>

            <div class="footer">
              <p>You are receiving this because you subscribed to Nawaya.</p>
              <p>&copy; ${new Date().getFullYear()} Nawaya. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
};

module.exports = welcomeEmail;