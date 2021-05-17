// const { MongoClient, Db } = require("mongodb");
const {User} = require("../models");
class Database {

  constructor() {
    
  }
  async findOrCreateUserFromLTI(launchInfo) {
    const [user] = await User.findOrCreate({
      where: {
        lmsUserId: launchInfo.userId,
      },
      defaults: {
        name: launchInfo.userFullName,
        email: launchInfo.userEmail,
        lmsUserId: launchInfo.userId,
      }
    });
    console.log(user);
    // const client = await MongoClient.connect(`mongodb://localhost:27017`);
    
    // const db = client.db(process.env.DB_NAME);
    
    // const user = await db.collection("users").findOne({
    //   lmsUserId: launchInfo.userId,
    // });
      
    // if (!user) {
    //   const result = await db.collection("users").insertOne(User.newFromLtiLaunch(launchInfo).toDoc());
    //   return User.fromDoc(result.ops[0]);
    // }

    // return User.fromDoc(user);
    return user;
  }
}

module.exports = Database;