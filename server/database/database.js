const { MongoClient, Db } = require("mongodb");
const User = require("../models/user");
class Database {
  async findOrCreateUserFromLTI(launchInfo, callback) {
    const client = await MongoClient.connect(`mongodb://localhost:27017`);
    
    const db = client.db(process.env.DB_NAME);
    
    const user = await db.collection("users").findOne({
      lmsUserId: launchInfo.userId,
    });
      
    if (!user) {
      const result = await db.collection("users").insertOne(User.newFromLtiLaunch(launchInfo).toDoc());
      console.log("A new user was created!!", result);
      callback(User.fromDoc(result.ops[0]));
    } else {
      console.log("User already exists", user)
      callback(User.fromDoc(user));
    }
  }
}

module.exports = Database;