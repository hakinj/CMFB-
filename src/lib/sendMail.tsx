import axios from 'axios';


type data = {
   name:string
   email:string
   subject?:string
   message?: string
}
const SendEmail = async  (data:data) => {
    const apiKey =  import.meta.env['VITE_BREVO_API_KEY']

     
    console.log(apiKey)


    const { name,email, subject, message } = data;
    const htmlMsg  = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Customer Support Request</title>
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
                    <span style="color: #ffffff; font-size: 18px; font-weight: 600; letter-spacing: 0.5px; display: block;">Customer Support</span>
                    <span style="color: #94a3b8; font-size: 12px; display: block; margin-top: 2px;">Inbound Support Ticket</span>
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
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #1e293b; line-height: 1.3;">
                New Support Request Received
              </h1>
              
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #475569; line-height: 1.5;">
                A new customer inquiry has been submitted through the contact portal. Below are the submission details:
              </p>

              <!-- Ticket Info Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding-bottom: 8px; font-size: 13px; color: #64748b; font-weight: 600; width: 90px;">Customer:</td>
                        <td style="padding-bottom: 8px; font-size: 14px; color: #0f172a; font-weight: 500;">${name}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 8px; font-size: 13px; color: #64748b; font-weight: 600;">Email:</td>
                        <td style="padding-bottom: 8px; font-size: 14px; color: #2563eb; font-weight: 500;">
                          <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #64748b; font-weight: 600;">Subject:</td>
                        <td style="font-size: 14px; color: #0f172a; font-weight: 500;">${subject || 'No Subject Provided'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message Details Header -->
              <h2 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.5px;">
                Customer Message
              </h2>

              <!-- Message Body Box -->
              <div style="background-color: #ffffff; border-left: 4px solid #2563eb; padding: 16px; border-top: 1px solid #f1f5f9; border-right: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; border-radius: 0 6px 6px 0; font-size: 14px; color: #334155; line-height: 1.6; white-space: pre-wrap;">
${message || 'No message content provided.'}
              </div>

              <!-- Reply Prompt CTA -->
              <div style="margin-top: 28px; padding: 16px; background-color: #eff6ff; border-radius: 6px; border: 1px solid #dbeafe;">
                <p style="margin: 0; font-size: 13px; color: #1e40af; line-height: 1.4;">
                  <strong>💡 Tip:</strong> You can respond directly to this email. Your reply will automatically be routed to <strong>${email}</strong>.
                </p>
              </div>
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
    subject,
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