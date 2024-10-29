const express = require("express");
const {
  getRegistrations,
  getRegistrationById,
  updateRegistration,
} = require("../controllers/yojanaListController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Yojana Registration List
 *   description: API for managing Yojana registrations list
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     YojanaRegistration:
 *       type: object
 *       properties:
 *         registerId:
 *           type: string
 *           description: Unique identifier for the registration
 *         userId:
 *           type: string
 *           description: User ID who registered for the Yojana
 *         yojanaName:
 *           type: string
 *           description: Name of the Yojana program
 *         fullName:
 *           type: string
 *           description: Full name of the applicant
 *         mobileNumber:
 *           type: string
 *           description: Mobile number of the applicant
 *         email:
 *           type: string
 *           description: Email of the applicant
 *         confirm:
 *           type: boolean
 *           description: Confirmation status of the registration
 *         trnxId:
 *           type: string
 *           description: Transaction ID associated with the registration
 *         entryDate:
 *           type: string
 *           format: date-time
 *           description: Date of registration
 */

/**
 * @swagger
 * /api/yojana-list:
 *   get:
 *     summary: Retrieve a list of Yojana registrations
 *     description: Retrieve a paginated list of Yojana registrations with optional search, sorting, and pagination.
 *     tags: [Yojana Registration List]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of registrations per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter registrations by name, mobile number, or registration ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: entryDate
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: List of Yojana registrations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of registrations
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 pages:
 *                   type: integer
 *                   description: Total number of pages
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/YojanaRegistration'
 *       500:
 *         description: Server error
 */
router.get("/", verifyToken, getRegistrations);

/**
 * @swagger
 * /api/yojana-list/{registerId}:
 *   get:
 *     summary: Retrieve a Yojana registration by ID
 *     description: Fetch a specific Yojana registration by its unique registration ID.
 *     tags: [Yojana Registration List]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: registerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique registration ID of the Yojana registration
 *     responses:
 *       200:
 *         description: Details of the Yojana registration
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/YojanaRegistration'
 *       404:
 *         description: Registration not found
 *       500:
 *         description: Server error
 */
router.get("/:registerId", verifyToken, getRegistrationById);

/**
 * @swagger
 * /api/yojana-list/{registerId}:
 *   put:
 *     summary: Update a Yojana registration
 *     description: Update the confirmation status and transaction ID of a specific Yojana registration.
 *     tags: [Yojana Registration List]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: registerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique registration ID of the Yojana registration to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               confirm:
 *                 type: boolean
 *                 description: Confirmation status of the registration
 *               trnxId:
 *                 type: string
 *                 description: Transaction ID for the registration
 *             example:
 *               confirm: true
 *               trnxId: "TXN-1234567890"
 *     responses:
 *       200:
 *         description: Yojana registration updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/YojanaRegistration'
 *       404:
 *         description: Registration not found
 *       500:
 *         description: Server error
 */
router.put("/:registerId", verifyToken, updateRegistration);

module.exports = router;
