import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for sending confirmation email
  app.post("/api/send-confirmation", async (req, res) => {
    const { email, patientName, doctorName, department, date, tokenNumber } = req.body;

    const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

    const missingVars = [];
    if (!EMAIL_HOST) missingVars.push("EMAIL_HOST");
    if (!EMAIL_PORT) missingVars.push("EMAIL_PORT");
    if (!EMAIL_USER) missingVars.push("EMAIL_USER");
    if (!EMAIL_PASS) missingVars.push("EMAIL_PASS");

    if (missingVars.length > 0) {
      console.error(`Email configuration missing: ${missingVars.join(", ")}`);
      return res.status(500).json({ 
        error: `Email service not configured. Missing variables: ${missingVars.join(", ")}. Please set these in the Settings > Environment Variables menu.` 
      });
    }

    if (!email) {
      return res.status(400).json({ error: "Recipient email is required" });
    }

    try {
      console.log(`Attempting to send email to ${email} via ${EMAIL_HOST}:${EMAIL_PORT}...`);
      const transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: parseInt(EMAIL_PORT),
        secure: parseInt(EMAIL_PORT) === 465,
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
        // Add timeout to prevent hanging
        connectionTimeout: 10000, 
        greetingTimeout: 10000,
        socketTimeout: 10000,
      });

      // Verify connection configuration
      await transporter.verify();
      console.log("SMTP connection verified successfully.");

      const mailOptions = {
        from: `"Silver Jubilee Hospital" <${EMAIL_USER}>`,
        to: email,
        subject: 'Appointment Confirmation - Silver Jubilee Hospital',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h1 style="color: #0B3C5D; text-align: center;">Appointment Confirmed!</h1>
            <p>Dear <strong>${patientName}</strong>,</p>
            <p>Your appointment at Silver Jubilee Hospital has been successfully booked. Here are the details:</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Doctor:</strong> ${doctorName}</p>
              <p style="margin: 5px 0;"><strong>Department:</strong> ${department}</p>
              <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
              <p style="margin: 5px 0; font-size: 1.2em; color: #328CC1;"><strong>Token Number:</strong> ${tokenNumber}</p>
            </div>
            <p>Please arrive at least 15 minutes before your scheduled time. If you need to cancel or reschedule, please contact us via the hospital website.</p>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="font-size: 0.8em; color: #6b7280; text-align: center;">
              Silver Jubilee Hospital, Baramati<br />
              This is an automated message, please do not reply.
            </p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Email sent successfully" });
    } catch (err: any) {
      console.error("Email error:", err);
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    // Server started
  });
}

startServer();
