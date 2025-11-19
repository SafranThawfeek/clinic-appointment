import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d'; //

// small sendEmail stub to avoid throwing if no mailer is configured
const sendEmail = async (to, subject, text) => {
  // In production, replace this with real email sending logic.
  console.log(`sendEmail stub -> to:${to} subject:${subject}`);
  console.log('email body:', text);
  return Promise.resolve();
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed }); //
    return res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password' });
 
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { //
      expiresIn: '1d',
    });
 
    res.json({ //
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  } //
};

// ✅ Forgot Password Controller
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'User not found with this email' });
 
    const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '10m' }); //
 
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`; //
    const emailBody = `Click here to reset your password: ${resetLink}`; //
    await sendEmail(user.email, 'Password Reset', emailBody); //
 
    // In development, return the resetLink in the response so developers can view it without email.
    if (process.env.NODE_ENV !== 'production') {
      return res.json({ message: 'Password reset link sent to email', resetLink });
    }
 
    res.json({ message: 'Password reset link sent to email' }); //
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// returns current authenticated user (expects authMiddleware to have set req.user)
export const me = (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  res.json({ user: req.user });
};

// Reset password using token
export const resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;
    if (!token || !password || !confirmPassword) return res.status(400).json({ message: 'Missing fields' });
    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET); //
    } catch (err) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
 
    const user = await User.findById(payload.id); //
    if (!user) return res.status(404).json({ message: 'User not found' });
 
    const hashed = await bcrypt.hash(password, 10); //
    user.password = hashed;
    await user.save();
 
    res.json({ message: 'Password reset successful' }); //
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};