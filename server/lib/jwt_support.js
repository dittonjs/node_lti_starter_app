const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  try {
    console.log("AM I FAILING HERE!")
    console.log(req.headers);
    const token = req.headers["authorization"].split(' ')[1];
    const jwtBody = jwt.verify(token, process.env.SECRET_KEY);
    console.log(jwtBody)
    req.jwtBody = jwtBody;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send("Invalid JWT Token");
  }
}

module.exports = { verifyJWT };