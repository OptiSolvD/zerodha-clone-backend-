const { UsersModel } = require("../models/UsersModel");

require("dotenv").config();

const jwt = require("jsonwebtoken");

module.exports.userVerification = async (

  req,
  res,
  next

) => {

  const token = req.cookies.token;

  if (!token) {

    return res.status(401).json({

      success: false,

      message: "No token found",

    });

  }

  try {

    const decoded = jwt.verify(

      token,

      process.env.TOKEN_KEY

    );

    const user = await UsersModel.findById(

      decoded.id

    );

    if (!user) {

      return res.status(401).json({

        success: false,

        message: "User not found",

      });

    }

    req.user = user;

    next();

  } catch (error) {

    return res.status(401).json({

      success: false,

      message: "Invalid token",

    });

  }

};