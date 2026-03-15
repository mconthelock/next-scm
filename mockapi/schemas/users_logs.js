const { faker } = require('@faker-js/faker');

const createUserLog = (id, users) => ({
    id: id,
    USR_LOGIN: users,
    LOG_TYPE: faker.helpers.arrayElement(['login', 'logout', 'failed_login']),
    LOG_TIMESTAMP: faker.date.past().toISOString(),
    LOG_IP: faker.internet.ip(),
});

module.exports = createUserLog;
