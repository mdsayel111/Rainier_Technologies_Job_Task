const express = require("express");
require("dotenv").config();
const bcrypt = require("bcrypt");

const fun = async () => {
  const hashedPassword = await bcrypt.hash("sayel111", 10);
  // console.log(hashedPassword);
  const isMatchPassword = await bcrypt.compare(
    "sayel111",
    "$2b$10$I8F5VvK5T1M0vPsj4i..guF.uoYlOz5iVCUXm39KzhH6hIRjtZoKe"
  );
  console.log(isMatchPassword);
};

fun();

const app = express();
const port = 5000;

app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    // Handle JSON parse error
    return res.status(500).json({ error: "Your JSON is not valid" });
  }
});

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

async function run() {
  const courseCollection = client
    .db("Rainier_Technologies_Job_Task")
    .collection("Courses");

  try {
    // User API
    app.get("/api/v1/course", async (req, res) => {
      try {
        const courses = await courseCollection.find({}).toArray();
        res.send(courses);
      } catch (err) {
        res.status(500).send({ massage: "Internal Server Error" });
      }
    });

    app.get("/api/v1/course/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const singleCourse = await courseCollection.findOne(query);
        res.status(200).send(singleCourse);
      } catch (err) {
        res.status(500).send({ massage: "Internal Server Error" });
      }
    });

    app.get("/api/v1/login", async (req, res) => {
      // const
    });

    // Admin API
    app.post("/api/v1/admin/course", async (req, res) => {
      try {
        const courseDetails = req.body;
        await courseCollection.insertOne(courseDetails);
        res
          .status(200)
          .send({ massage: "The course has been added successfully" });
      } catch (err) {
        res.status(500).send({ massage: "Internal Server Error" });
      }
    });

    app.patch("/api/v1/admin/course/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const { _id, ...updateCourseDetails } = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateCourse = {
          $set: { ...updateCourseDetails },
        };
        const result = await courseCollection.updateOne(filter, updateCourse);
        if (result.modifiedCount > 0) {
          res.status(200).send({ massage: "Your course updated successfully" });
        } else {
          res
            .status(404)
            .send({ massage: "Your updateable document is not found in DB" });
        }
      } catch (err) {
        res.status(500).send({ massage: "Internal Server Error" });
      }
    });

    app.delete("/api/v1/admin/course/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await courseCollection.deleteOne(query);
        console.log(result);
        if (result.deletedCount > 0) {
          res.status(200).send({ massage: "Your course deleted successfully" });
        } else {
          res
            .status(404)
            .send({ massage: "Your deletable document is not found in DB" });
        }
      } catch (err) {
        res.status(500).send({ massage: "Internal Server Error" });
      }
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
