const express = require("express");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { courseCollection, userCollection } = require("./DB.config");
const { verifyToken, verifyAdmin } = require("./utils");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { ObjectId } = require("mongodb");

const app = express();
const port = 5000;

app.use(express.json());

app.use(
  cors({
    origin: ["*"],
    credentials: true,
  })
);
app.use(cookieParser());

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    // Handle JSON parse error
    return res.status(500).json({ error: "Your JSON is not valid" });
  }
  next();
});

async function run() {
  try {
    // User API
    app.get("/api/v1/course", verifyToken, async (req, res) => {
      try {
        const courses = await courseCollection.find({}).toArray();
        res.send(courses);
      } catch (err) {
        res.status(500).send({ massage: "Internal Server Error" });
      }
    });

    app.get("/api/v1/course/:id", verifyToken, async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const singleCourse = await courseCollection.findOne(query);
        res.status(200).send(singleCourse);
      } catch (err) {
        console.log(err);
        res.status(500).send({ massage: "Internal Server Error" });
      }
    });

    app.get("/api/v1/login", async (req, res) => {
      try {
        const { email, password } = req.body;
        const user = await userCollection.findOne({ email: email });
        if (user) {
          const isPasswordMatch = await bcrypt.compare(password, user.hashedPassword);
          if (isPasswordMatch) {
            const token = jwt.sign({ email }, process.env.Secret, {
              expiresIn: "1d",
            });
            res
              .cookie("token", token, { httpOnly: true, secure: true })
              .send({ massage: "LogIn successful" });
          }
        } else {
          res.status(404).send({ massage: "user not found" });
        }
      } catch (err) {
        console.log(err);
        res.status(500).send({ massage: "Internal Server Error" });
      }
    });

    app.post("/api/v1/signup", async (req, res) => {
      try {
        const { email, password, role } = req.body;
        const isUserInDB = await userCollection.findOne({ email: email });
        if (!isUserInDB) {
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = { email, hashedPassword, role };
          const user = await userCollection.insertOne(newUser);
          res.send({ massage: "SignUp successful" });
        } else {
          res.send({ massage: "You already have an account" });
        }
      } catch (err) {
        res.status(500).send({ massage: "Internal Server Error" });
      }
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
