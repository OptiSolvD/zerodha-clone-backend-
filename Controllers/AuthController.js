const { UsersModel } = require("../models/UsersModel");
const { createSecretToken } = require("../utils/SecretToken");
const bcrypt = require("bcrypt");

module.exports.Signup = async (req, res) => {

  try {

    const { email, password, username, createdAt } = req.body;

    const existingUser = await UsersModel.findOne({ email });

    if (existingUser) {

      return res.json({
        success: false,
        message: "User already exists",
      });

    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UsersModel.create({
      email,
      password: hashedPassword,
      username,
      createdAt,
    });

    const token = createSecretToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(201).json({
      success: true,
      message: "User signed in successfully",
      user,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }
};

module.exports.Login = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {

      return res.json({
        success: false,
        message: "All fields are required",
      });

    }

    const user = await UsersModel.findOne({ email });

    if (!user) {

      return res.json({
        success: false,
        message: "Incorrect password or email",
      });

    }

    const auth = await bcrypt.compare(password, user.password);

    if (!auth) {

      return res.json({
        success: false,
        message: "Incorrect password or email",
      });

    }

    const token = createSecretToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(201).json({
      success: true,
      message: "User logged in successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }
};