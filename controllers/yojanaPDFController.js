const puppeteer = require("puppeteer");
const path = require("path");
const Yojana = require("../models/Yojana");
const User = require("../models/User");
const fs = require("fs");

exports.generatePDF = async (req, res) => {
  const { id } = req.params;

  try {
    const registration = await Yojana.findOne({ registerId: id });
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    const user = await User.findOne({ userID: registration.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.headers["x-real-ip"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket?.remoteAddress ||
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

    const photoPath = registration.photo
      ? getImageDataURI(
          path.resolve(__dirname, "../uploads", registration.photo)
        )
      : null;
    const signaturePath = registration.signature
      ? getImageDataURI(
          path.resolve(__dirname, "../uploads", registration.signature)
        )
      : null;
    const identityDocumentPath = registration.identityDocument
      ? getImageDataURI(
          path.resolve(__dirname, "../uploads", registration.identityDocument)
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
            .details-section th { font-weight: bold; background-color: #f2f2f2; }
            .declaration { font-size: 10px; margin-top: 10px; text-align: justify; padding: 5px; }
            .outer-border { border: 1px solid black; padding: 5px; }
            .bold-text { font-weight: bold; }
            .dotted { text-decoration: underline dotted; }
            .text-center { text-align: center; }
            .text-left { text-align: left; }
            .text-right { text-align: right; }
            .image-container { display: flex; justify-content: space-around; margin-top: 5px; }
            .image-container img { width: 70px; height: 70px; object-fit: cover; }
            .sign-container { text-align: left; margin-top: 2px; margin-bottom: 25px; }
            .auth-sign { text-align: right; margin-top: -40px; }
            .line-break { border: none; border-top: 1px solid black; margin: 20px 0; }
            .no-border { border: none; }
            .receipt-section { margin-top: 20px; text-align: center; }
            .receipt-table { width: 80%; margin: 0 auto; table-layout: fixed; }
            .long-line { border-top: 1px solid black; width: 100%; margin-top: 20px; }
            .identity-document { margin-top: 10px; text-align: right; }
            .identity-document img { width: 120px; height: auto; object-fit: contain; }
            .signature-image { width: 8cm; height: 1cm; object-fit: contain; }
            .passport-photo { width: 35mm; height: 45mm; object-fit: cover; }
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
                  <strong>Registered ID: ${registration.registerId}</strong>
                </td>
                <td align="right" colspan="4" style="font-size:11px; border:0px">आवेदन शुल्क - ${
                  registration.memberFees
                } रुपये मात्र</td>
              </tr>
              <tr>
                <th>आवेदिका का नाम</th>
                <td colspan="5">${registration.fullName}</td>
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
                <td colspan="5">${registration.guardianName}</td>
              </tr>
              <tr>
                <th>स्थाई पता ग्राम</th>
                <td colspan="6">${registration.address.village}</td>
              </tr>
              <tr>
                <th>राज्य</th>
                <td colspan="6">${registration.address.state}</td>
              </tr>
              <tr>
                <th>पोस्ट</th>
                <td colspan="2">${registration.address.post}</td>
                <th>थाना</th>
                <td colspan="2">${registration.address.policeStation}</td>
              </tr>
              <tr>
                <th>तहसील</th>
                <td>${registration.address.tehsil}</td>
                <th>जिला</th>
                <td>${registration.address.district}</td>
                <th>पिन कोड</th>
                <td>${registration.address.pincode}</td>
              </tr>
              <tr>
                <th>पत्र व्यवहार का पता ग्राम</th>
                <td colspan="6">${
                  registration.correspondenceAddress.village ||
                  registration.address.village
                }</td>
              </tr>
              <tr>
                <th>राज्य</th>
                <td colspan="6">${
                  registration.correspondenceAddress.state ||
                  registration.address.state
                }</td>
              </tr>
              <tr>
                <th>पोस्ट</th>
                <td colspan="2">${
                  registration.correspondenceAddress.post ||
                  registration.address.post
                }</td>
                <th>थाना</th>
                <td colspan="2">${
                  registration.correspondenceAddress.policeStation ||
                  registration.address.policeStation
                }</td>
              </tr>
              <tr>
                <th>तहसील</th>
                <td>${
                  registration.correspondenceAddress.tehsil ||
                  registration.address.tehsil
                }</td>
                <th>जिला</th>
                <td>${
                  registration.correspondenceAddress.district ||
                  registration.address.district
                }</td>
                <th>पिन कोड</th>
                <td>${
                  registration.correspondenceAddress.pincode ||
                  registration.address.pincode
                }</td>
              </tr>
              <tr>
                <th>आप किस पंचायत में कार्य करना चाहते हैं</th>
                <td colspan="6">${registration.preferredPanchayat || "N/A"}</td>
              </tr>
              <tr>
                <th>जन्म तिथि (अंकों में)</th>
                <td>${registration.dob.toLocaleDateString()}</td>
                <th>जाति</th>
                <td>${registration.category}</td>
                <th>पिता/अभिभावक की वार्षिक आय</th>
                <td colspan="2">${
                  registration.guardianAnnualIncome || "N/A"
                }</td>
              </tr>
              <tr>
                <th>संलग्न दस्तावेज</th>
                <td colspan="2">${registration.identityType}</td>
                <th>राशन कार्ड</th>
                <td colspan="2">${registration.rationCard || "N/A"}</td>
                <td rowspan="3" class="identity-document">
                  ${
                    identityDocumentPath
                      ? `<img src="${identityDocumentPath}" alt="Identity Document" />`
                      : ""
                  }
                </td>
              </tr>
              <tr>
                <th>संलग्न दस्तावेज न०</th>
                <td>${registration.documentNumber}</td>
                <th>मोबाईल न०</th>
                <td>${registration.mobileNumber}</td>
                <th>ई-मेल आई० डी०</th>
                <td>${registration.email || "N/A"}</td>
              </tr>
              <tr>
                <th>ग्राम प्रधान का नाम</th>
                <td colspan="2">${registration.villageHeadName || "N/A"}</td>
                <th>शैक्षणिक योग्यता</th>
                <td colspan="2">${registration.professionalInfo || "N/A"}</td>
              </tr>
              <tr>
                <th>संस्था का नाम</th>
                <td colspan="3">${
                  registration.previousTrainingInstitute || "N/A"
                }</td>
                <th>अनुभव (Years)</th>
                <td colspan="2">${registration.workDuration || "N/A"}</td>
              </tr>
              <tr>
                <th>IP-Address</th>
                <td colspan="3">${ipAddress}</td>
                <th>Date & time</th>
                <td colspan="2">${new Date().toLocaleString()}</td>
              </tr>
              <tr>
                <th>Txn-id</th>
                <td colspan="2">${registration.trnxId || "wallet"}</td>
                <th>Txn-date</th>
                <td colspan="1">${new Date().toLocaleDateString()}</td>
                <th>आवेदन शुल्क</th>
                <td colspan="2">${registration.memberFees} रुपये मात्र</td>
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
                <td class="dotted">${registration.registerId}</td>
                <td class="text-right">आवेदन शुल्क - ${
                  registration.memberFees
                } रुपये मात्र</td>
                <td class="text-left">दिनांक: ${new Date().toLocaleDateString()}</td>
              </tr>
              <tr>
                <td class="text-right">आवेदिका का नाम:</td>
                <td class="dotted">${registration.fullName}</td>
                <td class="text-right">पिता/पति का नाम:</td>
                <td class="dotted">${registration.guardianName}</td>
              </tr>
            </table>
          </div>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
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
