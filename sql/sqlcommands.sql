
DROP TABLE IF EXISTS userdata;

CREATE TABLE userdata(
    id SERIAL primary key,
    username VARCHAR UNIQUE,
    orderAmount INTEGER DEFAULT 0,
    momEnergy INTEGER DEFAULT 0,
    directorEnergy INTEGER DEFAULT 0,
    domEnergy INTEGER DEFAULT 0,
    gayEnergy INTEGER DEFAULT 0,
    secrets VARCHAR,
    adminConsent INT DEFAULT 0
);

