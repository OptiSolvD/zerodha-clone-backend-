const {UsersModel} = require("../models/UsersModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = async (req, res) => {

  const token = req.cookies.token;

  if (!token) {

    return res.json({
      status: false,
    });

  }

  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {

    if (err) {

      return res.json({
        status: false,
      });

    } else {

      const user = await UsersModel.findById(data.id);

      return res.json({
        status: true,
        user: {
          email: user.email,
          username: user.username,
          id: user._id,
        },
      });

    }

  });

};