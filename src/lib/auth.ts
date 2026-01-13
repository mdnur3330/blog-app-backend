import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
  trustedOrigins: [process.env.APP_URL!],
  
  user:{
    additionalFields:{
        role:{
            type: "string",
            defaultValue: "USER",
            required:false
        },
        phone:{
            type:"string",
            required:false
        },
        status:{
            type:"string",
            defaultValue:"ACTIVE",
            required:false
        }
    }
  },
    emailAndPassword: { 
    enabled: true, 
    autoSignIn:false,
    requireEmailVerification: true,
  },
  
  emailVerification: {
    sendOnSignUp:true,
    autoSignInAfterVerification:true,
    sendVerificationEmail: async ( { user, url, token }, request) => {
      const verificationUrl = `${process.env.APP_URl}/verify-email?token=${token}`
      const info = await transporter.sendMail({
    from: '"Md Nur Alom" <nuralomseddeki440@gmail.com>',
    to: user.email,
    subject: "Email Verification",
    text: "Verifi Your Email",
    html:`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Email Template</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;">
    <tr>
      <td align="center" style="padding:20px 0;">

        <!-- Email Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#0F3C3C; padding:20px; text-align:center;">
              <h1 style="color:#ffffff; margin:0; font-size:24px;">
                ${user.name}
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333333;">
              <h2 style="margin-top:0;">${user.name}</h2>

              <p style="font-size:16px; line-height:1.6;">
                Thank you for joining us. We’re excited to have you on board.
                This email template can be used for welcome messages, updates,
                or notifications.
              </p>

              <p style="font-size:16px; line-height:1.6;">
                Click the button below to get started:
              </p>

              <!-- Button -->
              <table cellpadding="0" cellspacing="0" style="margin:20px 0;">
                <tr>
                  <td style="background:#00C4CC; border-radius:5px;">
                    <a href=${url} target="_blank"
                      style="display:inline-block; padding:12px 24px; color:#ffffff; text-decoration:none; font-weight:bold;">
                      Get Started
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size:14px; color:#777;">
                If you have any questions, feel free to reply to this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f0f2f4; padding:15px; text-align:center; font-size:12px; color:#666;">
              © 2026 Your Company. All rights reserved.<br>
              Dhaka, Bangladesh
            </td>
          </tr>

        </table>
        <!-- End Container -->

      </td>
    </tr>
  </table>

</body>
</html>
`, 
  });

  console.log("Message sent:", info.messageId);
    },
  },
  socialProviders: {
    google: {
        prompt: "select_account consent",
        accessType:"offline",
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
}

});
