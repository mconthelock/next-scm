const { faker } = require('@faker-js/faker');

const createUserLog = (id, users) => ({
    id: id,
    LOG_ID: id,
    LOG_PROGRAM: faker.helpers.arrayElement([
        'login',
        'logout',
        'failed_login',
    ]),
    LOG_USER: users,
    LOG_IP: faker.internet.ip(),
    LOG_DATE: faker.date.past().toISOString(),
    LOG_STATUS: faker.helpers.arrayElement([0, 1]),
    LOG_REASON: '',
});

module.exports = createUserLog;
