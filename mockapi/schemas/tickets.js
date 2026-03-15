const { faker } = require('@faker-js/faker');

const createTickets = (id) => ({
    id: id,
    TICKET_ID: faker.string.uuid(),
    TICKET_TITLE: faker.lorem.sentence(),
    TICKET_DESCRIPTION: faker.lorem.paragraph(),
    TICKET_STATUS: faker.helpers.arrayElement([
        'open',
        'in_progress',
        'closed',
    ]),
    TICKET_PRIORITY: faker.helpers.arrayElement(['low', 'medium', 'high']),
    TICKET_CREATED_AT: faker.date.past().toISOString(),
    TICKET_UPDATED_AT: faker.date.recent().toISOString(),
});

module.exports = createTickets;
