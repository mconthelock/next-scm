const { faker } = require("@faker-js/faker");

const createVendor = (id) => {
	return {
		VND_ID: id,
		VND_NAME: faker.company.name(),
		VND_ADDRESS1: faker.location.streetAddress(),
		VND_ADDRESS2: faker.location.secondaryAddress(),
		VND_CITY: faker.location.city(),
		VND_STATE: faker.location.state(),
		VND_ZIP: faker.location.zipCode(),
		VND_COUNTRY: faker.location.country(),
		VND_PHONE: faker.phone.number(),
		VND_CREATED_AT: faker.date.past().toISOString(),
		VND_UPDATED_AT: faker.date.recent().toISOString(),
		VND_STATUS: faker.helpers.arrayElement([0, 1, 2]),
		VENDOR_CODES: [],
	};
};

module.exports = createVendor;
