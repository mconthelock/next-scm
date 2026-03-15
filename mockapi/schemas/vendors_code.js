const { faker } = require("@faker-js/faker");

const createVendorCode = (vndId, codeNum) => {
	return {
		CODE_NUM: codeNum,
		CODE_CURRENCY: faker.finance.currencyCode(),
		CODE_SHIP: faker.helpers.arrayElement(["Air", "Sea", "Land"]),
		CODE_PAY: faker.helpers.arrayElement(["Cash", "Credit", "Net 30"]),
		CODE_TYPE: faker.helpers.arrayElement([
			"Standard",
			"Express",
			"Overnight",
		]),
		CODE_STATUS: faker.helpers.arrayElement([0, 1, 2]),
		CODE_REGDATE: faker.date.past().toISOString(),
		VENDORS: vndId,
	};
};

module.exports = createVendorCode;
