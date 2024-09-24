var spicedPg = require("spiced-pg");
var database = spicedPg(
  process.env.DATABASE_URL  ||
    "postgres:postgres:postgres@localhost:5432/userdata"
);

/////get userdata from ID. 
module.exports.getUser= function getUser(id) {
  return database.query(`SELECT * FROM userdata WHERE id=$1`, [id]);
};
module.exports.getEveryone = function getEveryone() {
  return database.query(`SELECT * FROM userdata`);
};

module.exports.getUserDetails= function getUserDetails(username) {
  return database.query(`SELECT * FROM userdata WHERE username=$1`, [username]);
};

/////CREATING USERNAME AND ID
module.exports.createUser = function createUser(username) {
  return database.query(
    `INSERT INTO userdata (username) VALUES ($1) RETURNING *`,
    [username]
  );
};

module.exports.updateAdmin = function updateAdmin(binaryBool) {
  return database.query(
    `UPDATE userdata SET adminConsent = $1 WHERE username=admin RETURNING *`,
    [binaryBool]
  );
};

module.exports.updateEverything = function checkHumanity(username, param1, param2, param3,param4) {
  return database.query(
    `UPDATE userdata SET orderAmount = orderAmount + 1, momEnergy = momEnergy + $5, directorEnergy = directorEnergy + $3, domEnergy = domEnergy + $2, gayEnergy = gayEnergy + $4 WHERE username=$1 RETURNING *`,
    [username, param1, param2,param3,param4]  
  );
};














