const { MongoClient } = require("mongodb");
// const MONGODB_URL = "mongodb://localhost:27017";
// const MONGODB_NAME = "rental";
const client = new MongoClient(process.env.MONGODB_URL);

module.exports = {
  db: null,
  loginData: null,
  rentalData: null,
  async connect() {
    await client.connect();
    console.log("connected to", process.env.MONGODB_URL);
    this.db = client.db(process.env.MONGODB_NAME);
    console.log("connected to ", process.env.MONGODB_NAME);
    (this.loginData = this.db.collection("loginData")),
      (this.rentalData = this.db.collection("rentalData"));
  },
};
