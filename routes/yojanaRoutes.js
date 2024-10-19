const express = require("express");
const router = express.Router();
const { registerYojana } = require("../controllers/yojanaController");
const upload = require("../middleware/uploadMiddleware");
const { verifyToken } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Yojana
 *   description: API for Yojana form registration
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterYojana:
 *       type: object
 *       required:
 *         - yojanaName
 *         - fullName
 *         - guardianName
 *         - motherName
 *         - dob
 *         - gender
 *         - category
 *         - mobileNumber
 *         - address
 *         - identityType
 *         - documentNumber
 *       properties:
 *         yojanaName:
 *           type: string
 *           enum: ["FREE SEWING MACHINE DISTRIBUTION PARIYOJNA"]
 *           description: Name of the Yojana program
 *         fullName:
 *           type: string
 *           description: Full name of the applicant
 *         guardianName:
 *           type: string
 *           description: Name of the applicant's guardian (father or husband)
 *         motherName:
 *           type: string
 *           description: Mother's name of the applicant
 *         dob:
 *           type: string
 *           format: date
 *           description: Date of birth of the applicant (YYYY-MM-DD)
 *         gender:
 *           type: string
 *           enum: ["Male", "Female", "Other"]
 *           description: Gender of the applicant
 *         category:
 *           type: string
 *           enum: ["OBC", "General", "ST", "SC"]
 *           description: Category of the applicant
 *         mobileNumber:
 *           type: string
 *           description: Mobile number of the applicant
 *         email:
 *           type: string
 *           description: Email of the applicant (optional)
 *         address:
 *           type: object
 *           properties:
 *             state:
 *               type: string
 *             city:
 *               type: string
 *             village:
 *               type: string
 *             post:
 *               type: string
 *             policeStation:
 *               type: string
 *             tehsil:
 *               type: string
 *             district:
 *               type: string
 *             pincode:
 *               type: string
 *         correspondenceAddress:
 *           type: object
 *           properties:
 *             village:
 *               type: string
 *             post:
 *               type: string
 *             policeStation:
 *               type: string
 *             tehsil:
 *               type: string
 *             district:
 *               type: string
 *             pincode:
 *               type: string
 *         guardianAnnualIncome:
 *           type: string
 *           description: Annual income of the guardian
 *         rationCard:
 *           type: string
 *           description: Ration card details
 *         villageHeadName:
 *           type: string
 *           description: Name of the village head
 *         previousTrainingInstitute:
 *           type: string
 *           description: Previous training institute attended by the applicant
 *         workDuration:
 *           type: string
 *           description: Work experience duration
 *         preferredPanchayat:
 *           type: string
 *           description: Preferred panchayat for work
 *         identityType:
 *           type: string
 *           description: Type of identity document (e.g., Aadhar, Voter ID)
 *         documentNumber:
 *           type: string
 *           description: Document number of the provided identity
 *         photo:
 *           type: string
 *           format: binary
 *           description: Applicant's photo
 *         signature:
 *           type: string
 *           format: binary
 *           description: Applicant's signature
 *         identityDocument:
 *           type: string
 *           format: binary
 *           description: Applicant's identity document
 *       example:
 *         yojanaName: "FREE SEWING MACHINE DISTRIBUTION PARIYOJNA"
 *         fullName: "Amit Kumar"
 *         guardianName: "Rajesh Kumar"
 *         motherName: "Sunita Devi"
 *         dob: "1990-05-12"
 *         gender: "Male"
 *         category: "OBC"
 *         mobileNumber: "9876543210"
 *         email: "amit.kumar@example.com"
 *         address:
 *           state: "Uttar Pradesh"
 *           city: "Lucknow"
 *           village: "XYZ Village"
 *           post: "XYZ Post"
 *           policeStation: "XYZ Police Station"
 *           tehsil: "XYZ Tehsil"
 *           district: "Lucknow"
 *           pincode: "226001"
 *         correspondenceAddress:
 *           village: "XYZ Village"
 *           post: "XYZ Post"
 *           policeStation: "XYZ Police Station"
 *           tehsil: "XYZ Tehsil"
 *           district: "Lucknow"
 *           pincode: "226001"
 *         guardianAnnualIncome: "50000"
 *         rationCard: "APL"
 *         villageHeadName: "Ram Singh"
 *         previousTrainingInstitute: "XYZ Institute"
 *         workDuration: "2 years"
 *         preferredPanchayat: "ABC Panchayat"
 *         identityType: "Aadhar"
 *         documentNumber: "1234-5678-9101"
 */

/**
 * @swagger
 * /api/yojana/register:
 *   post:
 *     summary: Register for a Yojana program
 *     description: Allows users to register for a specific Yojana program by providing required details.
 *     tags: [Yojana]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/RegisterYojana'
 *     responses:
 *       201:
 *         description: Yojana registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   description: Details of the registered Yojana
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Server error
 */
router.post(
  "/register",
  verifyToken,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
    { name: "identityDocument", maxCount: 1 },
  ]),
  registerYojana
);

module.exports = router;
