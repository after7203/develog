const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

dotenv.config();

const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    req.decoded = { id: null }
    return next()
  }
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    // 토큰의 비밀키가 일치하지 않는 경우
    console.log(error)
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        code: 401,
        message: "유효하지 않은 토큰입니다.",
      });
    }
  }
};

module.exports = auth