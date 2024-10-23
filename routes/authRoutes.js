const express = require("express");
const {
  register,
  login,
  logout,
  updateUser,
} = require("../controllers/authController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API for user authentication
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterAdmin:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: The admin's name
 *         email:
 *           type: string
 *           description: The admin's email address
 *         password:
 *           type: string
 *           description: The admin's password
 *       example:
 *         name: Admin Test
 *         email: admin@example.com
 *         password: password123
 *     LoginUser:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email address
 *         password:
 *           type: string
 *           description: The user's password
 *       example:
 *         email: admin@example.com
 *         password: password123
 *     UpdateUser:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The user's name
 *         password:
 *           type: string
 *           description: The user's password (Admins only)
 *         role:
 *           type: string
 *           description: The user's role (Admins only)
 *       example:
 *         name: Updated Admin
 *         password: newpassword123
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new admin
 *     description: Allows an admin to register another admin.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The admin's name
 *               email:
 *                 type: string
 *                 description: The admin's email address
 *               password:
 *                 type: string
 *                 description: The admin's password
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                 userID:
 *                   type: string
 *                   description: Generated Admin User ID
 *       400:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
router.post("/register", verifyToken, isAdmin, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and provides a JWT token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 description: The user's password
 *     responses:
 *       200:
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logs out the user by invalidating the JWT token.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Token missing from request
 *       500:
 *         description: Server error
 */
router.post("/logout", verifyToken, logout);

/**
 * @swagger
 * /api/auth/update/{userID}:
 *   put:
 *     summary: Update user information (Admins and Supervisors)
 *     description: Allows updating user information. Admins can update any user, while Supervisors can only update their own details.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name
 *               password:
 *                 type: string
 *                 description: The user's password (Admins only)
 *               role:
 *                 type: string
 *                 description: The user's role (Admins only)
 *     responses:
 *       200:
 *         description: User updated successfully
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.put("/update/:userID", verifyToken, updateUser);

module.exports = router;
