import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, topic, message } = await req.json();

    // ---- TRANSPORTER ----
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // ------------------------------
    // ✨ MODERN HTML EMAIL TEMPLATE
    // ------------------------------
    const htmlTemplate = `
  <div style="
    font-family: 'Arial', sans-serif; 
    background:#f4f6f8; 
    padding: 30px;
  ">
    <div style="
      max-width: 600px; 
      margin: auto; 
      background: #ffffff; 
      border-radius: 14px; 
      padding: 30px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    ">
      
      <!-- HEADER -->
      <h2 style="
        margin: 0; 
        text-align:center; 
        color:#006039; 
        font-size: 22px;
      ">
        📩 Çocuk Tribünü Projesinden Yeni Mesaj
      </h2>

      <p style="text-align:center; color:#555; margin-top: 6px; font-size: 14px;">
        Web iletişim formundan yeni bir mesaj aldınız.
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

      <!-- CONTENT BOX -->
      <div style="
        background:#f9fafb; 
        padding: 20px; 
        border-radius: 12px; 
        border:1px solid #e5e7eb;
      ">

        <p style="margin: 0 0 10px;">
          <strong style="color:#333;">👤 Gönderen:</strong><br />
          <span style="color:#555;">${name}</span>
        </p>

        <p style="margin: 0 0 10px;">
          <strong style="color:#333;">📧 E-posta:</strong><br />
          <span style="color:#555;">${email}</span>
        </p>

        <p style="margin: 0 0 10px;">
          <strong style="color:#333;">🎯 Konu:</strong><br />
          <span style="color:#555;">${topic}</span>
        </p>

        <p style="margin: 0 0 10px;">
          <strong style="color:#333;">💬 Mesaj:</strong><br />
          <span style="
            color:#444;
            background:white;
            padding: 12px;
            display:block;
            margin-top: 6px;
            border-radius:10px;
            border:1px solid #eee;
            line-height: 1.5;
          ">
            ${message.replace(/\n/g, "<br/>")}
          </span>
        </p>

      </div>

      <!-- FOOTER -->
      <p style="
        margin-top: 25px; 
        text-align:center; 
        color:#777; 
        font-size: 12px;
      ">
        Bu e-posta Çocuk Tribünü iletişim formu üzerinden otomatik olarak gönderilmiştir.
      </p>

    </div>
  </div>
`;

    // ---- MAIL CONTENT ----
    const mailOptions = {
      from: `"Çocuk Tribünü İletişim" <${process.env.MAIL_USER}>`,
      to: "ozenshopping.com@gmail.com",
      subject: "Çocuk Tribünü Projesinden Yeni Mesaj",
      html: htmlTemplate,
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
