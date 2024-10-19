const express = require("express");
const router = express.Router();
const { getStates, getCitiesByState } = require("../utils/locationService");

/**
 * @swagger
 * tags:
 *   name: Location
 *   description: API for fetching states and cities in India
 */

/**
 * @swagger
 * /api/location/states:
 *   get:
 *     summary: Get all states in India
 *     tags: [Location]
 *     responses:
 *       200:
 *         description: List of states in India
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Uttar Pradesh"
 *                   isoCode:
 *                     type: string
 *                     example: "UP"
 *                   countryCode:
 *                     type: string
 *                     example: "IN"
 *       500:
 *         description: Server error
 */
router.get("/states", (req, res) => {
  const states = getStates();
  res.json(states);
});

/**
 * @swagger
 * /api/location/cities/{stateCode}:
 *   get:
 *     summary: Get all cities for a given state in India
 *     tags: [Location]
 *     parameters:
 *       - in: path
 *         name: stateCode
 *         required: true
 *         description: ISO code of the state (e.g., "UP" for Uttar Pradesh)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of cities in the specified state
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Lucknow"
 *                   stateCode:
 *                     type: string
 *                     example: "UP"
 *                   countryCode:
 *                     type: string
 *                     example: "IN"
 *       400:
 *         description: Invalid state code
 *       500:
 *         description: Server error
 */
router.get("/cities/:stateCode", (req, res) => {
  const { stateCode } = req.params;
  const cities = getCitiesByState(stateCode);
  res.json(cities);
});

module.exports = router;
