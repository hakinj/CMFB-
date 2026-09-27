import axios from 'axios';


type data = {
  
message?: string
}
const SendEmail = async  (data:data) => {
    const apiKey =  import.meta.env['VITE_BREVO_API_KEY']

     
    console.log(apiKey)


    const { message } = data;
    const htmlMsg  = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Message</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #333333;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f6f8; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb;">
          
          <!-- Header with Logo & Brand -->
          <tr>
            <td style="background-color: #0f172a; padding: 24px 32px; text-align: left;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="vertical-align: middle; width: 48px;">
                    <!-- Logo Circle Styling -->
                    <div style="width: 40px; height: 40px; background-color: #ffffff; border-radius: 50%; text-align: center; line-height: 40px; font-weight: bold; font-size: 20px; color: #0f172a;">
                      C
                    </div>
                  </td>
                  <td style="vertical-align: middle; padding-left: 12px;">
                    <span style="color: #ffffff; font-size: 18px; font-weight: 600; letter-spacing: 0.5px; display: block;">Verification Code</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Banner Accent Line -->
          <tr>
            <td style="height: 4px; background-color: #2563eb;"></td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 32px; text-align: center;">
              <h1 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #1e293b;">
                Your One-Time Password (OTP)
              </h1>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #64748b; line-height: 1.5;">
                Use the verification code below to complete your sign-in request. This code is valid for 10 minutes.
              </p>

              <!-- Centered OTP Card -->
              <table role="presentation" align="center" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 28px auto;">
                <tr>
                  <td style="background-color: #f1f5f9; border: 1px dashed #2563eb; border-radius: 8px; padding: 16px 36px; text-align: center;">
                    <span style="font-family: 'Courier New', Courier, monospace, sans-serif; font-size: 32px; font-weight: 700; color: #2563eb; letter-spacing: 8px; display: block;">
                      ${message}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Security Warning -->
              <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.4;">
                If you did not request this verification code, please ignore this email or contact support if you have concerns. Never share your OTP with anyone.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b;">
                This is an automated notification from your Customer Support System.
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                © ${new Date().getFullYear()} Confidential BANK & TRUST. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`


    const payload = {
    sender: { name:'customer', email:'akinjide19@gmail.com' },
    to: [{
      email: "stevendudley921@gmail.com",
    }],
    subject:'OTP Message',
    htmlContent:htmlMsg
  };

  try {
    console.log('trying')
    const res = await axios.post('https://api.brevo.com/v3/smtp/email', payload, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      }
    });
    console.log(res.status)
    if(res.data.messageId){
        console.log('success')
    return { success: true, id: res.data.messageId };

    }


  } catch (error: any) {
    if (axios.isAxiosError(error)) {
    console.log("Brevo status:", error.response?.status);
    console.log("Brevo response:", error.response?.data);
  }
  }

  return {
      success: false,
      error: "Failed to send email",
    };

}

export default SendEmail