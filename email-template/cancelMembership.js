const cancelMembership = ( userName, email ) => {
    // Brand Colors
    const primaryGreen = "#1a4731"; // Deep Forest Green
    const warningAmber = "#ffc107"; // For the status alert
    
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
            }
            .content {
              padding: 40px;
              text-align: center;
            }
            .status-badge {
              display: inline-block;
              padding: 8px 16px;
              background-color: #fff3cd;
              color: #856404;
              border-radius: 20px;
              font-weight: bold;
              font-size: 13px;
              margin-bottom: 20px;
            }
            .content h2 {
              font-size: 22px;
              color: ${primaryGreen};
              margin-bottom: 15px;
            }
            .content p {
              font-size: 16px;
              color: #666666;
              line-height: 1.6;
              margin-bottom: 25px;
            }
            .info-box {
              background-color: #f8f9fa;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
              text-align: left;
              border-left: 4px solid #dee2e6;
            }
            .info-box ul {
              margin: 10px 0 0 20px;
              padding: 0;
              color: #555;
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
              <div class="status-badge">MEMBERSHIP: EXPIRED / RETURNED TO WAITLIST</div>
              <h2>We're sorry to see you go, ${userName}</h2>
              <p>
                This is a notification to confirm that your Nawaya Premium subscription has ended. Your account has been moved back to our standard access level.
              </p>
              
              <div class="info-box">
                <strong>What happens now?</strong>
                <ul>
                  <li>Your premium tools are now locked.</li>
                  <li>Your historical data remains safe in your account.</li>
                  <li>You have been placed back on our early access waitlist.</li>
                </ul>
              </div>

              <p>Was this a mistake? If your payment failed or you've changed your mind, you can restore your access instantly.</p>
              

            </div>

            <div class="footer">
              <p>Account associated with: ${email}</p>
              <p>&copy; ${new Date().getFullYear()} Nawaya. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
};

module.exports = cancelMembership;