const { userCollection } = require("./DB.config");
var jwt = require("jsonwebtoken");

const verifyAdmin = async (req, res, next) => {
  const { email } = req.user;
  const user = await userCollection.findOne({ email: email });
  if (user && user.role == "admin") {
    next();
  }
};

const verifyToken = (req, res, next) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.Secret, function (err, decoded) {
    if (!err) {
      req.user = decoded;
      next();
    } else {
      res
        .status(401)
        .send({ massage: "unauthorized access, please send req with valid token" });
    }
  });
};

module.exports = { verifyToken, verifyAdmin };
