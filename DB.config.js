const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.BD_UserName}:${process.env.DB_Password}@cluster0.zje3wdr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const courseCollection = client
  .db("Rainier_Technologies_Job_Task")
  .collection("Courses");

const userCollection = client
  .db("Rainier_Technologies_Job_Task")
  .collection("User");

module.exports = { courseCollection, userCollection };
