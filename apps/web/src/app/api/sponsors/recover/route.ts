import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sponsors } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateSignedUrl(editToken: string): string {
  const expires = Date.now() + 60 * 60 * 1000; // 1 hour
  const secret = process.env.SPONSOR_SECRET ?? "sponsor-default-secret";
  const data = `${editToken}:${expires}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("hex");

  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://api2cli.dev";
  return `${base}/sponsor/edit/${editToken}?sig=${signature}&exp=${expires}`;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email } = body as { email?: string };

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const [sponsor] = await db
    .select({ editToken: sponsors.editToken, name: sponsors.name })
    .from(sponsors)
    .where(eq(sponsors.email, email.toLowerCase().trim()))
    .limit(1);

  // Always return success to prevent email enumeration
  if (!sponsor) {
    return NextResponse.json({ ok: true });
  }

  const editUrl = generateSignedUrl(sponsor.editToken);

  await resend.emails.send({
    from: "api2cli <hey@melyvnx.com>",
    to: email,
    subject: "Your api2cli sponsor edit link",
    html: `
      <div style="font-family: monospace; max-width: 480px; margin: 0 auto; padding: 32px 16px;">
        <h2 style="font-size: 18px;">api2cli Sponsor Access</h2>
        <p style="color: #888; font-size: 14px;">
          Hi${sponsor.name ? ` ${sponsor.name}` : ""},<br/>
          Here's your link to edit your sponsorship:
        </p>
        <a href="${editUrl}" style="display: inline-block; background: #D54747; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; margin: 16px 0;">
          Edit my sponsorship
        </a>
        <p style="color: #666; font-size: 12px;">
          This link expires in 1 hour. If you didn't request this, ignore this email.
        </p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
