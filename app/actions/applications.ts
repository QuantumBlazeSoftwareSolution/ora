"use server";

import { db } from "@/db";
import { businessApplications } from "@/db/schemas/business-applications";
import { eq } from "drizzle-orm";

export async function submitBusinessApplication(data: {
  name: string;
  email: string;
  phone: string;
  storeName: string;
  storeSlug: string;
  categoryId: string;
  subscriptionId: string;
  nicUrls: string[];
  businessRegUrl?: string;
}) {
  try {
    // Check if email already applied (pending)
    const existing = await db
      .select()
      .from(businessApplications)
      .where(eq(businessApplications.email, data.email));

    const pending = existing.find((a) => a.status === "pending");
    if (pending) {
      return {
        success: false,
        error: "You already have a pending application.",
      };
    }

    await db.insert(businessApplications).values({
      applicantName: data.name,
      email: data.email,
      phone: data.phone,
      storeName: data.storeName,
      storeSlug: data.storeSlug,
      categoryId: data.categoryId,
      subscriptionId: data.subscriptionId,
      nicUrls: data.nicUrls,
      businessRegUrl: data.businessRegUrl,
      status: "pending",
    });

    // Send Email to Admin
    try {
      const transporter = require("nodemailer").createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: '"Ora System" <no-reply@ora.lk>',
        to: process.env.SMTP_USER, // Sending to admin email (using SMTP_USER as admin for now)
        subject: `New Business Application: ${data.storeName}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h1>New Business Application Received</h1>
            <p><strong>Store Name:</strong> ${data.storeName}</p>
            <p><strong>Applicant:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Slug:</strong> ${data.storeSlug}</p>
            <p>Please review it in the Admin Dashboard.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/ora-owners/applications">Go to Dashboard</a>
          </div>
        `,
      });

      // Send Receipt Email to Applicant
      await transporter.sendMail({
        from: '"Ora System" <no-reply@ora.lk>',
        to: data.email,
        subject: "We received your application! 🚀",
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h1 style="color: #6d28d9;">Application Received</h1>
            <p>Hi ${data.name.split(" ")[0]},</p>
            <p>Thanks for applying to register <strong>${data.storeName}</strong> with Ora.</p>
            <p>Our team will review your application and documents shortly. You will receive another email once your store is approved.</p>
            <p>If you have any questions, feel free to reply to this email.</p>
            <br/>
            <p>Best regards,<br/>The Ora Team</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send admin notification:", emailError);
      // Don't block success response
    }

    return { success: true };
  } catch (error) {
    console.error("Application failed:", error);
    return { success: false, error: "Failed to submit application." };
  }
}
