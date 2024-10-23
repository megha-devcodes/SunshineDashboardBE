const express = require("express");
const {
  createSupervisorApplication,
  generateCredentials,
  approveApplication,
  rejectApplication,
  getAllApplications,
  deleteApplication,
} = require("../controllers/applicationController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Supervisor Application
 *   description: APIs related to Supervisor Applications
 */

/**
 * @swagger
 * /api/application/generate-credentials:
 *   get:
 *     summary: Generate user ID and password
 *     tags: [Supervisor Application]
 *     responses:
 *       200:
 *         description: Credentials generated successfully
 *       500:
 *         description: Failed to generate credentials
 */
router.get("/generate-credentials", generateCredentials);

/**
 * @swagger
 * /api/application/submit:
 *   post:
 *     summary: Submit a new supervisor application
 *     tags: [Supervisor Application]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Full name of the applicant
 *               fatherName:
 *                 type: string
 *                 description: Father's name
 *               motherName:
 *                 type: string
 *                 description: Mother's name
 *               dob:
 *                 type: string
 *                 format: date
 *                 description: Date of Birth (dd-mm-yyyy)
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *                 description: Gender
 *               caste:
 *                 type: string
 *                 enum: [General, OBC, SC, ST]
 *                 description: Caste category
 *               mobileNumber:
 *                 type: string
 *                 description: Mobile number
 *               email:
 *                 type: string
 *                 description: Email address
 *               yojnaName:
 *                 type: string
 *                 description: Name of the Yojana
 *               jobType:
 *                 type: string
 *                 description: Job type applied for
 *               registrationFee:
 *                 type: number
 *                 description: Registration fee
 *               permanentAddress:
 *                 type: object
 *                 properties:
 *                   addressLine:
 *                     type: string
 *                   post:
 *                     type: string
 *                   policeStation:
 *                     type: string
 *                   tehsil:
 *                     type: string
 *                   district:
 *                     type: string
 *                   state:
 *                     type: string
 *                   pincode:
 *                     type: string
 *               correspondenceAddress:
 *                 type: object
 *                 properties:
 *                   addressLine:
 *                     type: string
 *                   post:
 *                     type: string
 *                   policeStation:
 *                     type: string
 *                   tehsil:
 *                     type: string
 *                   district:
 *                     type: string
 *                   state:
 *                     type: string
 *                   pincode:
 *                     type: string
 *               identityDocumentType:
 *                 type: string
 *                 description: Type of identity document
 *               documentNumber:
 *                 type: string
 *                 description: Identity document number
 *               attachedDocument:
 *                 type: string
 *                 format: binary
 *               photo:
 *                 type: string
 *                 format: binary
 *               signature:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       500:
 *         description: Failed to submit application
 */
router.post(
    "/submit",
    upload.fields([
      { name: "photo", maxCount: 1 },
      { name: "signature", maxCount: 1 },
      { name: "attachedDocument", maxCount: 1 },
    ]),
    (req, res, next) => {
      req.body.applicationType = "supervisor";
      next();
    },
    createSupervisorApplication
  );

/**
 * @swagger
 * /api/application/all:
 *   get:
 *     summary: Fetch all supervisor applications (Admin only)
 *     tags: [Supervisor Application]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: "createdAt"
 *         description: Field to sort results by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           default: "desc"
 *         description: Sort order (asc/desc)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for applications
 *     responses:
 *       200:
 *         description: Applications fetched successfully
 *       500:
 *         description: Failed to fetch applications
 */
router.get("/all", verifyToken, isAdmin, getAllApplications);

/**
 * @swagger
 * /api/application/approve/{applicationId}:
 *   patch:
 *     summary: Approve a supervisor application (Admin only)
 *     tags: [Supervisor Application]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the supervisor application
 *     responses:
 *       200:
 *         description: Application approved successfully
 *       404:
 *         description: Application not found
 *       400:
 *         description: Application has already been processed
 *       500:
 *         description: Failed to approve application
 */
router.patch(
  "/approve/:applicationId",
  verifyToken,
  isAdmin,
  approveApplication,
);

/**
 * @swagger
 * /api/application/reject/{applicationId}:
 *   patch:
 *     summary: Reject a supervisor application (Admin only)
 *     tags: [Supervisor Application]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the supervisor application
 *     responses:
 *       200:
 *         description: Application rejected successfully
 *       404:
 *         description: Application not found
 *       500:
 *         description: Failed to reject application
 */
router.patch("/reject/:applicationId", verifyToken, isAdmin, rejectApplication);

/**
 * @swagger
 * /api/application/delete/{applicationId}:
 *   delete:
 *     summary: Delete a supervisor application (Admin only)
 *     tags: [Supervisor Application]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the supervisor application to delete
 *     responses:
 *       200:
 *         description: Application deleted successfully
 *       404:
 *         description: Application not found
 *       500:
 *         description: Failed to delete application
 */
router.delete(
  "/delete/:applicationId",
  verifyToken,
  isAdmin,
  deleteApplication,
);

module.exports = router;
