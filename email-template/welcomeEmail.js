const welcomeEmail = (userName, planName = "Nawaya Founder Access", email, password) => {
    // Brand Colors from Figma/Site
    const limeGreen = "#94BD1C";
    const tealGreen = "#29C28C";
    const lightBg = "#F7FAF3";
    const darkText = "#2D3A1A"; // Dark forest green for readability (not black)

    return `
      <!DOCTYPE html>
      <html> 
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 0;
              background-color: ${lightBg};
              color: ${darkText};
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background: #ffffff;
              border-radius: 30px;
              overflow: hidden;
              box-shadow: 0 10px 30px rgba(148, 189, 28, 0.1);
              border: 1px solid #ffffff;
            }
            .header {
              background: linear-gradient(135deg, ${limeGreen} 0%, ${tealGreen} 100%);
              text-align: center;
              padding: 50px 20px;
              color: #ffffff;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 800;
              letter-spacing: -0.5px;
            }
            .content {
              padding: 40px 30px;
              text-align: center;
            }
            .welcome-badge {
              display: inline-block;
              padding: 6px 16px;
              background-color: rgba(148, 189, 28, 0.1);
              color: ${limeGreen};
              border-radius: 100px;
              font-weight: bold;
              font-size: 12px;
              margin-bottom: 20px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .content h2 {
              font-size: 24px;
              color: ${darkText};
              margin-bottom: 20px;
              line-height: 1.3;
            }
            .perks-list {
              text-align: left;
              background-color: #fcfdfb;
              border: 1px solid #eef3e8;
              border-radius: 20px;
              padding: 25px;
              margin: 25px 0;
            }
            .perk-item {
              margin-bottom: 15px;
              font-size: 15px;
              display: flex;
              align-items: center;
            }
            .button {
              display: inline-block;
              padding: 16px 40px;
              background-color: ${limeGreen};
              color: #ffffff !important;
              text-decoration: none;
              border-radius: 100px;
              font-weight: bold;
              font-size: 16px;
              margin: 20px 0;
              box-shadow: 0 8px 20px rgba(148, 189, 28, 0.3);
            }
            .discount-box {
              background-color: #EAF7F2;
              border: 2px dashed ${tealGreen};
              border-radius: 15px;
              padding: 20px;
              margin: 25px 0;
            }
            .credentials-box {
              padding: 20px;
              background-color: #f8f9fa;
              border-radius: 15px;
              text-align: left;
              font-size: 14px;
            }
            .footer {
              padding: 30px;
              text-align: center;
              font-size: 11px;
              color: #999999;
              line-height: 1.5;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
               <h1>NAWAYA</h1>
               <p style="margin-top:10px; opacity:0.9;">Founder Access Unlocked</p>
            </div>
            
            <div class="content">
              <div class="welcome-badge">Founding Member Status</div>
              <h2>Welcome, ${userName} — you’re officially a Nawaya Founding Member.</h2>
              
              <p style="color: #666; font-size: 16px;">Thanks for joining Nawaya early. Your Founder Access is now active. Here’s what you’ve unlocked:</p>
              
              <div class="perks-list">
                <div class="perk-item">🎥 <b>Founder Video:</b> Watch the private message right away</div>
                <div class="perk-item">📅 <b>One-time 15-minute founder call:</b> Book your slot</div>
                <div class="perk-item">🎁 <b>30% discount:</b> Applied to your first year subscription at launch</div>
                <div class="perk-item">🏷️ <b>Founding Member badge:</b> Added to your future account</div>
              </div>

          
              <div class="discount-box">
                <span style="font-size: 12px; color: ${tealGreen}; font-weight: bold; text-transform: uppercase;">Your Exclusive Discount Code</span>
                <h3 style="margin: 10px 0; font-size: 24px; color: ${tealGreen}; letter-spacing: 2px;">FOUNDING30</h3>
                <p style="margin: 0; font-size: 12px; color: #666;">Valid for the first year subscription at launch.</p>
              </div>

              <div class="credentials-box">
                <span style="font-size: 11px; font-weight: bold; color: ${limeGreen}; text-transform: uppercase;">Secure Account Credentials</span>
                <p style="margin: 10px 0 5px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 0;"><strong>Password:</strong> ${password}</p>
              </div>
            </div>

              <p style="font-weight: bold; color: ${darkText};">Access your Founder page:</p>
              <a href="${process.env.CLIENT_URI}/login" class="button">Go to Founder Access</a>


            <div class="footer">
              <p>Didn’t receive an email after 15 minutes? Check your spam folder or contact support at <a href="mailto:support@nawaya.com" style="color: ${limeGreen};">support@nawaya.com</a>.</p>
              <p>&copy; ${new Date().getFullYear()} Nawaya. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
};

module.exports = welcomeEmail;