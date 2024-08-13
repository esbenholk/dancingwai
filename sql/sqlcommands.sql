
DROP TABLE IF EXISTS userdata;

CREATE TABLE userdata(
    id SERIAL primary key,
    username VARCHAR,
    orderAmount INTEGER,
    momEnergy INTEGER,
    directorEnergy INTEGER,
    domEnergy INTEGER,
    gayEnergy INTEGER,
    secrets VARCHAR
);
