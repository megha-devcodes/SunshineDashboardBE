const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const Yojana = require("../models/Yojana");

exports.generatePDF = async (req, res) => {
  const { id } = req.params;

  try {
    const registration = await Yojana.findOne({ registerId: id }).populate(
      "userId",
      "name"
    );
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    const ipAddress =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    const photoPath = registration.photo
      ? path.join(__dirname, "../uploads", registration.photo)
      : null;
    const signaturePath = registration.signature
      ? path.join(__dirname, "../uploads", registration.signature)
      : null;
    const identityDocumentPath = registration.identityDocument
      ? path.join(__dirname, "../uploads", registration.identityDocument)
      : null;

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .header { text-align: center; font-size: 18px; font-weight: bold; }
            .subheader { text-align: center; font-size: 16px; }
            .small-text { font-size: 12px; text-align: center; margin-bottom: 20px; }
            .outer-border { border: 2px solid black; padding: 15px; margin: 20px; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
            .table td, .table th { border: 1px solid black; padding: 8px; } /* Separate inner borders */
            .declaration { font-size: 10px; margin-top: 20px; }
            .footer { margin-top: 30px; font-size: 10px; text-align: center; }
            .inner-content { padding: 15px; } /* Padding inside the outer border */
            .images-section { text-align: center; margin-top: 20px; }
            .images-section img { width: 100px; height: 100px; object-fit: cover; margin-right: 10px; }
            .image-label { text-align: center; font-size: 10px; margin-top: 5px; }
            .image-container { display: flex; justify-content: space-evenly; margin-top: 20px; } /* Aligns the images in a consistent grid */
          </style>
        </head>
        <body>
          <!-- Outer Border for All Details -->
          <div class="outer-border">
            <div class="inner-content">
              <!-- Header Section -->
              <div class="header">निःशुल्क सिलाई मशीन वितरण परियोजना</div>
              <div class="subheader">सूर्योदय फाउंडेशन द्वारा संचालित</div>
              <div class="subheader">(भारत सरकार द्वारा पंजीकृत)</div>
              <div class="small-text">
                हेड ऑफिस - जी 0 टी 0 रोड हनुमानगंज, शेखर कॉम्प्लेक्स, तीसरी मंजिल, प्रयागराज (उत्तर प्रदेश)
              </div>
              <div class="small-text">टोल-फ्री नंबर - 1800 – 890 – 9199</div>

              <!-- Registration Details Table -->
              <div class="details-section">
                <table class="table">
                  <tr>
                    <td>पंजीकृत आईडी:</td>
                    <td>${registration.registerId}</td>
                    <td>आवेदन शुल्क:</td>
                    <td>${registration.memberFees} रुपये मात्र</td>
                  </tr>
                  <tr>
                    <td>आवेदिका का नाम:</td>
                    <td>${registration.fullName}</td>
                    <td>पिता/पति का नाम:</td>
                    <td>${registration.guardianName}</td>
                  </tr>
                  <tr>
                    <td>जन्म तिथि:</td>
                    <td>${registration.dob.toLocaleDateString()}</td>
                    <td>जाति:</td>
                    <td>${registration.category}</td>
                  </tr>
                  <tr>
                    <td>राशन कार्ड:</td>
                    <td>${registration.rationCard || "N/A"}</td>
                    <td>मोबाइल न०:</td>
                    <td>${registration.mobileNumber}</td>
                  </tr>
                  <tr>
                    <td>ई-मेल आई० डी०:</td>
                    <td>${registration.email || "N/A"}</td>
                    <td>Txn-id:</td>
                    <td>${registration.trnxId || "wallet"}</td>
                  </tr>
                </table>
              </div>

              <!-- Address Section (Permanent and Correspondence) -->
              <div class="details-section">
                <table class="table">
                  <tr>
                    <td>स्थाई पता:</td>
                    <td>ग्राम: ${registration.address.village}</td>
                    <td>पोस्ट:</td>
                    <td>${registration.address.post}</td>
                  </tr>
                  <tr>
                    <td>तहसील:</td>
                    <td>${registration.address.tehsil}</td>
                    <td>जिला:</td>
                    <td>${registration.address.district}</td>
                  </tr>
                  <tr>
                    <td>पिन कोड:</td>
                    <td>${registration.address.pincode}</td>
                  </tr>
                </table>

                <table class="table">
                  <tr>
                    <td>पत्र व्यवहार का पता:</td>
                    <td>ग्राम: ${
                      registration.correspondenceAddress.village ||
                      registration.address.village
                    }</td>
                    <td>पोस्ट:</td>
                    <td>${
                      registration.correspondenceAddress.post ||
                      registration.address.post
                    }</td>
                  </tr>
                  <tr>
                    <td>तहसील:</td>
                    <td>${
                      registration.correspondenceAddress.tehsil ||
                      registration.address.tehsil
                    }</td>
                    <td>जिला:</td>
                    <td>${
                      registration.correspondenceAddress.district ||
                      registration.address.district
                    }</td>
                  </tr>
                  <tr>
                    <td>पिन कोड:</td>
                    <td>${
                      registration.correspondenceAddress.pincode ||
                      registration.address.pincode
                    }</td>
                  </tr>
                </table>
              </div>

              <!-- Image Section for Photo, Signature, and Identity Document -->
              <div class="image-container">
                ${
                  photoPath
                    ? `<div><img src="file://${photoPath}" alt="Photo"><div class="image-label">Photo</div></div>`
                    : ""
                }
                ${
                  signaturePath
                    ? `<div><img src="file://${signaturePath}" alt="Signature"><div class="image-label">Signature</div></div>`
                    : ""
                }
                ${
                  identityDocumentPath
                    ? `<div><img src="file://${identityDocumentPath}" alt="Identity Document"><div class="image-label">Identity Document</div></div>`
                    : ""
                }
              </div>

              <!-- Declaration Section -->
              <div class="declaration">
                <p>घोषणा पत्र:</p>
                <p>मैं प्रमाणित करता हूँ / करती हूँ कि मेरे द्वारा दिए गए विवरण सही हैं, इसमें किसी भी प्रकार का कोई तथ्य छिपाया नहीं गया है।</p>
                <p>अगर इसमें कोई भी त्रुटि पाई जाती है, तो इसकी पूरी जिम्मेदारी मेरी होगी। संस्था को दी गई सदस्यता शुल्क को भविष्य में किसी भी परिस्थिति में वापस लेने का दावा नहीं करूंगा / करूंगी।</p>
              </div>

              <!-- Footer -->
              <div class="footer">
                IP Address: ${ipAddress}<br>
                Date & Time: ${new Date().toLocaleString()}
              </div>
            </div> <!-- End of Inner Content -->
          </div> <!-- End of Outer Border -->
        </body>
      </html>
    `;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfPath = path.join(
      __dirname,
      "../public/pdfs",
      `${registration.registerId}.pdf`
    );

    await page.pdf({ path: pdfPath, format: "A4", printBackground: true });

    await browser.close();

    res.status(200).json({ message: "PDF generated successfully", pdfPath });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
