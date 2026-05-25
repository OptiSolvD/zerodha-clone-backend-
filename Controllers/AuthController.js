const { UsersModel } = require("../models/UsersModel");
const bcrypt = require("bcrypt");

const { generateToken } = require("../utils/SecretToken");

// LOGIN CONTROLLER

const login = async (req, res) => {

  try {

    const { username, password } = req.body;

    if (!username || !password) {

      return res.status(400).json({

        message:
          "Please provide username and password",

      });

    }

    const user =
      await UsersModel.findOne({ username });

    if (!user) {

      return res.status(404).json({

        message: "User not found",

      });

    }

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {

      return res.status(401).json({

        message: "Invalid credentials",

      });

    }

    const token = generateToken(user);

    res.cookie("token", token, {

      httpOnly: true,

      secure:
        process.env.NODE_ENV === "production",

      sameSite: "none",

      maxAge: 24 * 60 * 60 * 1000,

    });

    return res.status(200).json({

      message: "Login successful",

      user: {

        id: user._id,

        username: user.username,

        email: user.email,

      },

    });

  } catch (e) {

    console.log(e);

    return res.status(500).json({

      message: `Something went wrong ${e}`,

    });

  }

};
// REGISTER CONTROLLER

const register = async (req, res) => {

  try {

    const { username, email, password } = req.body;

    // Validation

    if (!username || !email || !password) {

      return res.status(400).json({

        message: "Please provide all fields",

      });

    }

    // Check existing user

    const existingUser =
      await UsersModel.findOne({ email });

    if (existingUser) {

      return res.status(409).json({

        message: "User already exists",

      });

    }

    // Hash password

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Create new user

    const newUser = new UsersModel({

      username,

      email,

      password: hashedPassword,

    });

    // Save user

    await newUser.save();

    // Generate token

    const token = generateToken(newUser);

    // Store cookie

    res.cookie("token", token, {

      httpOnly: true,

      secure:
        process.env.NODE_ENV === "production",

      sameSite: "strict",

      maxAge: 24 * 60 * 60 * 1000,

    });

    // Success response

    return res.status(201).json({

      message: "User registered successfully",

      user: {

        id: newUser._id,

        username: newUser.username,

        email: newUser.email,

      },

    });

  } catch (e) {

    console.log(e);

    return res.status(500).json({

      message: `Something went wrong ${e}`,

    });

  }

};

module.exports = {

  login,

  register,

};