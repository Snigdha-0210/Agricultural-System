const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, phone, password, location, farmSize, cropTypes } = req.body;
    
    const userExists = await User.findOne({ phone });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name, phone, password: hashedPassword,
      profile: { location, farmSize, cropTypes }
    });

    res.status(201).json({
      user,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        user,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid phone number or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};