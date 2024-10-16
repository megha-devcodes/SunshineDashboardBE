const express = require("express");
const router = express.Router();
const { getStates, getCitiesByState } = require("../utils/locationService");

router.get("/states", (req, res) => {
  const states = getStates();
  res.json(states);
});

router.get("/cities/:stateCode", (req, res) => {
  const { stateCode } = req.params;
  const cities = getCitiesByState(stateCode);
  res.json(cities);
});

module.exports = router;
