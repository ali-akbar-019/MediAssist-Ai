const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mediassist';

const updateAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Define a minimal schema if the model isn't easily importable as JS
    const userSchema = new mongoose.Schema({
      email: String,
      role: String
    });
    
    // Check if model already exists to avoid OverwriteModelError
    const User = mongoose.models.User || mongoose.model('User', userSchema);

    const user = await User.findOneAndUpdate(
      { email: 'gamesforever018@gmail.com' },
      { role: 'admin' },
      { new: true }
    );

    if (user) {
      console.log(`🚀 SUCCESS: User ${user.email} is now an ${user.role}`);
    } else {
      console.log('❌ ERROR: User gamesforever018@gmail.com not found in database');
      const allUsers = await User.find({}, 'email');
      console.log('Available users:', allUsers.map(u => u.email));
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('💥 Migration Failed:', err.message);
    process.exit(1);
  }
};

updateAdmin();
