import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, topic, message } = await req.json();

    // ---- MAIL TRANSPORTER ----
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // ---- MAIL CONTENT ----
    const mailOptions = {
      from: `"Çocuk Tribünü İletişim" <${process.env.MAIL_USER}>`,
      to: "iletisim@cocuktribunu.org", // BURAYA MESAJLARIN GELMESİNİ İSTEDİĞİN MAILİ YAZ
      subject: `Yeni İletişim Mesajı – ${topic}`,
      text: `
Ad: ${name}
E-posta: ${email}
Konu: ${topic}

Mesaj:
${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: "Mail başarıyla gönderildi." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("MAIL ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
