const { State, City } = require("country-state-city");

const getStates = () => {
  return State.getStatesOfCountry("IN");
};

const getCitiesByState = (stateCode) => {
  return City.getCitiesOfState("IN", stateCode);
};

module.exports = { getStates, getCitiesByState };
