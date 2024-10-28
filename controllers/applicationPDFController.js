const puppeteer = require("puppeteer");
const path = require("path");
const SupervisorApplication = require("../models/SupervisorApplication");
const fs = require("fs");

exports.generateApplicationPDF = async (req, res) => {
  const { id } = req.params;

  try {
    const application = await SupervisorApplication.findOne({ userId: id });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.headers["x-real-ip"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      "N/A";

    function getImageDataURI(filePath) {
      try {
        const fileData = fs.readFileSync(filePath);
        const base64Data = fileData.toString("base64");
        const mimeType = "image/jpeg";
        return `data:${mimeType};base64,${base64Data}`;
      } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return null;
      }
    }

    const photoPath = application.photo
      ? getImageDataURI(
          path.resolve(__dirname, "../uploads", application.photo)
        )
      : null;
    const signaturePath = application.signature
      ? getImageDataURI(
          path.resolve(__dirname, "../uploads", application.signature)
        )
      : null;
    const attachedDocumentPath = application.attachedDocument
      ? getImageDataURI(
          path.resolve(__dirname, "../uploads", application.attachedDocument)
        )
      : null;

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; font-size: 11px; margin: 15px; padding: 0; }
            .header { text-align: center; font-size: 16px; font-weight: bold; }
            .subheader { text-align: center; font-size: 12px; }
            .small-text { font-size: 10px; text-align: center; margin-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 5px; text-align: justify; font-size: 10px; }
            .outer-border { border: 1px solid black; padding: 5px; }
            .declaration { font-size: 10px; margin-top: 10px; text-align: justify; padding: 5px; }
            .image-container { display: flex; justify-content: space-around; margin-top: 5px; }
            .passport-photo { width: 35mm; height: 45mm; object-fit: cover; }
            .identity-document img { width: 120px; height: auto; object-fit: contain; }
            .signature-image { width: 8cm; height: 1cm; object-fit: contain; }
            .sign-container { text-align: left; margin-top: 2px; margin-bottom: 25px; }
            .auth-sign { text-align: right; margin-top: -40px; }
            .receipt-section { margin-top: 20px; text-align: center; }
            .receipt-table { width: 80%; margin: 0 auto; table-layout: fixed; }
          </style>
        </head>
        <body>
          <div class="outer-border">
            <table>
              <tr>
                <td align="center" colspan="7">
                  <h3 style="text-align: center;">आवेदन फार्म<br>निःशुल्क सिलाई मशीन वितरण परियोजना</h3>
                  <strong style="display: block; text-align: center;">सूर्योदय फाउंडेशन द्वारा संचालित</strong>
                  <p class="small-text" style="text-align: center;">(भारत सरकार द्वारा पंजीकृत)<br>
                    हेड ऑफिस - जी 0 टी 0 रोड हनुमानगंज, शेखर कॉम्प्लेक्स तीसरी मंजिल, प्रयागराज (उत्तर प्रदेश)<br>
                    टोल-फ्री नंबर - 1800 – 890 – 9199</p>
                </td>
              </tr>
              <tr>
                <td align="left" colspan="3" style="padding:5px">
                  <strong>Registered ID: ${application.userId}</strong>
                </td>
                <td align="right" colspan="4" style="font-size:11px; border:0px">आवेदन शुल्क - ${
                  application.registrationFee
                } रुपये मात्र</td>
              </tr>
              <tr>
                <th>आवेदिका का नाम</th>
                <td colspan="5">${application.fullName}</td>
                <td rowspan="5">
                  ${
                    photoPath
                      ? `<img class="passport-photo" src="${photoPath}" alt="Photo">`
                      : ""
                  }
                </td>
              </tr>
              <tr>
                <th>पिता/पति का नाम</th>
                <td colspan="5">${application.fatherName}</td>
              </tr>
              <tr>
                <th>स्थाई पता ग्राम</th>
                <td colspan="6">${application.permanentAddress.addressLine}</td>
              </tr>
              <tr>
                <th>राज्य</th>
                <td colspan="6">${application.permanentAddress.state}</td>
              </tr>
              <tr>
                <th>पोस्ट</th>
                <td colspan="2">${application.permanentAddress.post}</td>
                <th>थाना</th>
                <td colspan="2">${application.permanentAddress.policeStation}</td>
              </tr>
              <tr>
                <th>तहसील</th>
                <td>${application.permanentAddress.tehsil}</td>
                <th>जिला</th>
                <td>${application.permanentAddress.district}</td>
                <th>पिन कोड</th>
                <td>${application.permanentAddress.pincode}</td>
              </tr>
              <tr>
                <th>पत्र व्यवहार का पता ग्राम</th>
                <td colspan="6">${application.correspondenceAddress.addressLine || application.permanentAddress.addressLine}</td>
              </tr>
              <tr>
                <th>राज्य</th>
                <td colspan="6">${application.correspondenceAddress.state || application.permanentAddress.state}</td>
              </tr>
              <tr>
                <th>पोस्ट</th>
                <td colspan="2">${application.correspondenceAddress.post || application.permanentAddress.post}</td>
                <th>थाना</th>
                <td colspan="2">${application.correspondenceAddress.policeStation || application.permanentAddress.policeStation}</td>
              </tr>
              <tr>
                <th>तहसील</th>
                <td>${application.correspondenceAddress.tehsil || application.permanentAddress.tehsil}</td>
                <th>जिला</th>
                <td>${application.correspondenceAddress.district || application.permanentAddress.district}</td>
                <th>पिन कोड</th>
                <td>${application.correspondenceAddress.pincode || application.permanentAddress.pincode}</td>
              </tr>
              <tr>
                <th>आप किस पंचायत में कार्य करना चाहते हैं</th>
                <td colspan="6">${application.preferredPanchayat || "N/A"}</td>
              </tr>
              <tr>
                <th>जन्म तिथि (अंकों में)</th>
                <td>${application.dob.toLocaleDateString()}</td>
                <th>जाति</th>
                <td>${application.caste}</td>
                <th>पिता/अभिभावक की वार्षिक आय</th>
                <td colspan="2">${application.guardianAnnualIncome || "N/A"}</td>
              </tr>
              <tr>
                <th>संलग्न दस्तावेज</th>
                <td colspan="2">${application.identityDocumentType}</td>
                <th>राशन कार्ड</th>
                <td colspan="2">${application.rationCard || "N/A"}</td>
                <td rowspan="3" class="identity-document">
                  ${
                    attachedDocumentPath
                      ? `<img src="${attachedDocumentPath}" alt="Attached Document" />`
                      : ""
                  }
                </td>
              </tr>
              <tr>
                <th>संलग्न दस्तावेज न०</th>
                <td>${application.documentNumber}</td>
                <th>मोबाईल न०</th>
                <td>${application.mobileNumber}</td>
                <th>ई-मेल आई० डी०</th>
                <td>${application.email || "N/A"}</td>
              </tr>
              <tr>
                <th>ग्राम प्रधान का नाम</th>
                <td colspan="2">${application.villageHeadName || "N/A"}</td>
                <th>शैक्षणिक योग्यता</th>
                <td colspan="2">${application.educationalQualification || "N/A"}</td>
              </tr>
              <tr>
                <th>संस्था का नाम</th>
                <td colspan="3">${application.previousTrainingInstitute || "N/A"}</td>
                <th>अनुभव (Years)</th>
                <td colspan="2">${application.experienceYears || "N/A"}</td>
              </tr>
              <tr>
                <th>IP-Address</th>
                <td colspan="3">${ipAddress}</td>
                <th>Date & time</th>
                <td colspan="2">${new Date().toLocaleString()}</td>
              </tr>
              <tr>
                <th>Txn-id</th>
                <td colspan="2">${application.trnxId || "wallet"}</td>
                <th>Txn-date</th>
                <td colspan="1">${new Date().toLocaleDateString()}</td>
                <th>आवेदन शुल्क</th>
                <td colspan="2">${application.registrationFee} रुपये मात्र</td>
              </tr>
            </table>
            <div class="declaration">
              <p>मैं प्रमाणित करता हूँ / करती हूँ कि मेरे द्वारा दिए गए विवरण सही है, इसमें किसी भी प्रकार का कोई भी तथ्य छिपाया नहीं गया है, अगर इसमें किसी भी प्रकार कि कोई भी त्रुटि पाई जाती है तो इसकी पूरी जिम्मेदारी मेरी होगी । तथा मेरे द्वारा संस्था को दी गई सदस्यता शुल्क को भविष्य में किसी भी परिस्थिति में वापस लेने का दावा नहीं करूंगा / करूंगी । यह मेरा स्वयं का निर्णय है । अगर मैं भविष्य में संस्था के खिलाफ किसी भी तरह कि कार्यवाही करता हूँ / करती हूँ तो संस्था मेरे ऊपर कोई भी कानूनी कार्यवाही कर सकती है , इसके लिए मैं किसी भी प्रशासनिक या न्यायालय का सहारा नही लूँगा / लूँगी ।</p>
            </div>
            <div class="sign-container">
              ${
                signaturePath
                  ? `<img class="signature-image" src="${signaturePath}" alt="Signature" />`
                  : ""
              }
              <div class="auth-sign">
                <span>Authority Sign</span>
              </div>
            </div>
          </div>
          <hr class="long-line" />
          <div class="receipt-section">
            <h3 class="text-center">प्राप्ति रशीद</h3>
            <table class="receipt-table no-border">
              <tr>
                <td class="text-right">पंजीकृत आईडी :</td>
                <td class="dotted">${application.userId}</td>
                <td class="text-right">आवेदन शुल्क - ${application.registrationFee} रुपये मात्र</td>
                <td class="text-left">दिनांक: ${new Date().toLocaleDateString()}</td>
              </tr>
              <tr>
                <td class="text-right">आवेदिका का नाम:</td>
                <td class="dotted">${application.fullName}</td>
                <td class="text-right">पिता/पति का नाम:</td>
                <td class="dotted">${application.fatherName}</td>
              </tr>
            </table>
          </div>
        </body>
      </html>
    `;

    const pdfDirectory = path.join(__dirname, "../public/pdfs");
    if (!fs.existsSync(pdfDirectory)) {
      fs.mkdirSync(pdfDirectory, { recursive: true });
      console.log(`Directory created: ${pdfDirectory}`);
    }

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfPath = path.join(pdfDirectory, `${application.userId}.pdf`);
    await page.pdf({ path: pdfPath, format: "A4", printBackground: true });
    await browser.close();

    console.log(`PDF generated at: ${pdfPath}`);

    res.download(pdfPath, `${application.userId}.pdf`, (err) => {
      if (err) {
        console.error("Failed to download PDF:", err);
        res.status(500).send({ message: "Failed to download PDF.", error: err });
      }
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Server error", error });
  }
};