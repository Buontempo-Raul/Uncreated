// backend/controllers/authController.js - Updated login handler 
// This would be in your authController.js file
// backend/controllers/authController.js
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', email); // Debugging

    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    console.log('Password match:', isMatch); // Debugging

    if (isMatch) {
      // Generate token
      const token = generateToken(user._id);
      
      res.json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          // Include other user data
          token
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};