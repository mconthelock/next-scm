const GROUP_DEFINITIONS = [
    { GRP_ID: 1, GRP_CODE: 'ADM', GRP_NAME: 'Admin', GRP_STATUS: 1 },
    { GRP_ID: 2, GRP_CODE: 'BUY', GRP_NAME: 'Buyer', GRP_STATUS: 1 },
    { GRP_ID: 3, GRP_CODE: 'SUP', GRP_NAME: 'Supplier', GRP_STATUS: 1 },
];

const createUserGroup = (id, userId, group) => ({
    GRP_ID: group.GRP_ID,
    GRP_CODE: group.GRP_CODE,
    GRP_NAME: group.GRP_NAME,
    GRP_STATUS: group.GRP_STATUS,
});

module.exports = { createUserGroup, GROUP_DEFINITIONS };
