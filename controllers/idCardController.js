const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const bwipjs = require("bwip-js");
const Supervisor = require("../models/Supervisor");

const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directory created: ${dirPath}`);
  }
};

exports.generateIdCard = async (req, res) => {
  try {
    const { userId } = req.params;

    const supervisorData = await Supervisor.findOne({ userId });
    if (!supervisorData) {
      return res.status(404).json({ message: "Supervisor not found." });
    }

    const qrCodeDetails = `
      Register ID: ${supervisorData.userId}
      Full Name: ${supervisorData.fullName}
      Father's Name: ${supervisorData.fatherName}
      Mobile: ${supervisorData.mobileNumber}
      Joining Date: ${supervisorData.joiningDate.toLocaleDateString()}
      Address: ${supervisorData.state}, ${supervisorData.city}
    `;

    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeDetails);

    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: "code128",
      text: supervisorData.userId,
      scale: 2,
      height: 20,
      includetext: false,
      textxalign: "center",
      backgroundcolor: "FFFFFF",
    });
    const barcodeBase64 = `data:image/png;base64,${barcodeBuffer.toString(
      "base64"
    )}`;

    const outputDir = path.join(__dirname, "../output");
    ensureDirectoryExists(outputDir);

    const htmlContent = `
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }
                    .id-card {
                        width: 85.6mm;
                        height: 54mm;
                        background-color: white;
                        border-radius: 10px;
                        display: flex;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                        overflow: hidden;
                        border: 1px solid #ccc;
                    }
                    .left-section {
                        background-color: #1c3e87;
                        width: 40%;
                        padding: 10px;
                        color: white;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        align-items: flex-start;
                        text-align: left;
                    }
                    .left-section .details p {
                        font-size: 8px;
                        line-height: 1.2;
                        margin: 2px 0;
                    }
                    .left-section .barcode {
                        width: 70px;
                        height: 30px;
                        margin-top: 10px;
                        align-self: center;
                    }
                    .right-section {
                        width: 60%;
                        padding: 10px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: space-between;
                        text-align: center;
                    }
                    .right-section .photo {
                        width: 60px;
                        height: 60px;
                        border-radius: 50%;
                        object-fit: cover;
                    }
                    .right-section h2 {
                        font-size: 14px;
                        font-weight: bold;
                    }
                    .right-section p {
                        font-size: 8px;
                    }
                    .right-section .qr-code {
                        width: 40px;
                        height: 40px;
                        margin-top: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="id-card">
                    <div class="left-section">
                        <div class="details">
                            <p>Register ID: <strong>${
                              supervisorData.userId
                            }</strong></p>
                            <p>Father's Name: <strong>${
                              supervisorData.fatherName
                            }</strong></p>
                            <p>Mobile: <strong>${
                              supervisorData.mobileNumber
                            }</strong></p>
                            <p>Joining Date: <strong>${supervisorData.joiningDate.toLocaleDateString()}</strong></p>                
                        </div>
                        <img class="barcode" src="${barcodeBase64}" alt="Barcode">
                    </div>
                    <div class="right-section">
                        <img class="photo" src="file://${path.join(
                          __dirname,
                          "../uploads/supervisor/photos",
                          supervisorData.photo
                        )}" alt="Supervisor Photo">
                        <h2>${supervisorData.fullName}</h2>
                        <p>Address: ${supervisorData.state}, ${
      supervisorData.city
    }</p>
                        <img class="qr-code" src="${qrCodeDataUrl}" alt="QR Code">
                    </div>
                </div>
            </body>
        </html>
        `;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

    const pdfPath = path.join(
      outputDir,
      `${supervisorData.userId}_id_card.pdf`
    );
    await page.pdf({
      path: pdfPath,
      width: "85.6mm",
      height: "54mm",
      printBackground: true,
      pageRanges: "1",
    });

    await browser.close();
    console.log(`ID card generated at: ${pdfPath}`);
    res.download(pdfPath);
  } catch (error) {
    console.error("Failed to generate ID card:", error);
    res.status(500).send({ message: "Failed to generate ID card.", error });
  }
};
