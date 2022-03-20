const KEEN_LP = "0xa96C4f4960C43D2649Ac4eDc281e2172d632866f";
const KEEN_ADDRESS = "0x7254000925E19d9bEF3B156E9b0ADC24C9761E0E";
const ISKEEN_ADDRESS = "0xAC53b3dFB93CCcEaE015E7B5C1Cef4681a2D3d9e";
const BOND_ADDRESS = "0x1B5195c40adB6D1d3fdB17E6fb98b80726D1Aa9e";

// length of epoch, in seconds
const PERIOD_LENGTH = 6 * 60 * 60;

// in UTC timestamp. 2022-3-22 6:00:00 PM UTC
// oracle doing its oracley thing, it has a
// strange start time cuz i made it have one
const START_TIME = 1647972000;

module.exports = [KEEN_LP, PERIOD_LENGTH, START_TIME];
