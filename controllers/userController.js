const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.registerUser = async (req, res) => {
  const { password, email, avatar, fullName } = req.body;
  try {
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      password: hashedPassword,
      email,
      avatar,
      fullName,
      lastActive: new Date(),
      online: false,
      created: new Date(),
      updated: new Date(),
    });

    // Save the user to the database
    await user.save();

    // Respond with the created user
    res.status(201).json(user);
  } catch (error) {
    // Handle any errors that occur during registration
    res.status(500).json({ message: error.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body; // Changed from username to email
  try {
    const user = await User.findOne({ email }); // Use email instead of username
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
