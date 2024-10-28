const puppeteer = require("puppeteer");
const path = require("path");
const Supervisor = require("../models/Supervisor");
const fs = require("fs");
const QRCode = require("qrcode");

exports.generateCertificate = async (req, res) => {
  const { userId } = req.params;
  const {
    date,
    role = "Volunteer",
    description = "For exemplary dedication, unwavering commitment, and significant contributions to our organization’s mission. Your efforts have made a lasting impact and are truly appreciated.",
  } = req.body;

  try {
    const supervisor = await Supervisor.findOne({ userId });
    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    const formattedDate = date || new Date().toLocaleDateString();

    const qrCodeData = JSON.stringify({
      supervisorName: supervisor.fullName,
      userId: supervisor.userId,
      role: role,
      date: formattedDate,
      certificateDescription: description,
    });
    const qrCodeDataURL = await QRCode.toDataURL(qrCodeData);

    const htmlContent = `
      <html>
        <head>
          <style>
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body {
              font-family: 'Georgia', serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background: #f9f9f9;
              margin: 0;
            }
            .certificate-container {
              width: 1000px;
              height: 700px;
              padding: 40px;
              border: 10px solid #4b0082;
              background: white;
              text-align: center;
              position: relative;
              color: #333;
              display: flex;
              flex-direction: column;
              justify-content: center;
              box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
            }
            .certificate-title {
              font-size: 36px;
              font-weight: bold;
              color: #4b0082;
              letter-spacing: 1.5px;
              margin-bottom: 20px;
            }
            .certificate-subtitle {
              font-size: 18px;
              color: #777;
              margin-bottom: 30px;
            }
            .recipient-name {
              font-size: 30px;
              font-weight: bold;
              color: #2c3e50;
              margin: 20px 0;
            }
            .description {
              font-size: 16px;
              color: #555;
              margin: 10px 0;
              line-height: 1.4;
              padding: 0 50px;
            }
            .role-text {
              font-size: 20px;
              color: #333;
              font-style: italic;
              margin-top: 15px;
            }
            .footer {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 50px;
              font-size: 16px;
            }
            .footer .date, .footer .signature {
              width: 180px;
              text-align: center;
              color: #4b0082;
            }
            .qr-container {
              position: absolute;
              bottom: 20px;
              left: 50%;
              transform: translateX(-50%);
              width: 100px;
              height: 100px;
            }
            .qr-container img {
              width: 100%;
              height: 100%;
            }
          </style>
        </head>
        <body>
          <div class="certificate-container">
            <div class="certificate-title">Certificate of Appreciation</div>
            <div class="certificate-subtitle">This certificate is proudly presented to</div>
            <div class="recipient-name">${supervisor.fullName}</div>
            <div class="description">${description}</div>
            <div class="role-text">${role}</div>
            <div class="footer">
              <div class="date">${formattedDate}</div>
              <div class="signature">Signature</div>
            </div>
            <div class="qr-container">
              <img src="${qrCodeDataURL}" alt="QR Code">
            </div>
          </div>
        </body>
      </html>
    `;

    const pdfDirectory = path.join(__dirname, "../public/certificates");
    if (!fs.existsSync(pdfDirectory)) {
      fs.mkdirSync(pdfDirectory, { recursive: true });
    }

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfPath = path.join(
      pdfDirectory,
      `${supervisor.userId}-certificate.pdf`,
    );
    await page.pdf({
      path: pdfPath,
      format: "A4",
      landscape: true,
      printBackground: true,
    });
    await browser.close();

    res.download(pdfPath, `${supervisor.userId}-certificate.pdf`, (err) => {
      if (err) {
        console.error("Failed to download PDF:", err);
        res
          .status(500)
          .send({ message: "Failed to download PDF.", error: err });
      }
    });
  } catch (error) {
    console.error("Error generating certificate:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
