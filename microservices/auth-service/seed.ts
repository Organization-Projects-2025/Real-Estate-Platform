import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

// User schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  authType: { type: String, default: 'local' },
  profilePicture: { type: String, default: '' },
  role: {
    type: String,
    enum: ['user', 'agent', 'admin', 'developer'],
    default: 'user',
  },
  phoneNumber: { type: String },
  whatsapp: { type: String },
  contactEmail: { type: String },
  active: { type: Boolean, default: true },
  savedProperties: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

async function seedAdmin() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/real-estate-auth';
    console.log('Connecting to MongoDB:', mongoUri.replace(/:[^:]+@/, ':****@'));
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@realestate.com' });
    if (existingAdmin) {
      console.log('✓ Admin user already exists');
      console.log('\n📧 Admin Credentials:');
      console.log('   Email: admin@realestate.com');
      console.log('   Password: Admin@123456');
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin@123456', 12);
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@realestate.com',
      password: hashedPassword,
      role: 'admin',
      phoneNumber: '+1234567890',
      active: true,
    });

    console.log('✓ Admin user created successfully!');
    console.log('\n📧 Admin Credentials:');
    console.log('   Email: admin@realestate.com');
    console.log('   Password: Admin@123456');
    console.log('\n🔐 Admin Dashboard: http://localhost:5173/admin');
    console.log('   (After login, you\'ll be redirected to the admin dashboard)');

    // Create a test developer user
    const hashedDevPassword = await bcrypt.hash('Developer@123456', 12);
    const existingDev = await User.findOne({ email: 'developer@realestate.com' });
    if (!existingDev) {
      await User.create({
        firstName: 'Developer',
        lastName: 'User',
        email: 'developer@realestate.com',
        password: hashedDevPassword,
        role: 'developer',
        phoneNumber: '+1987654321',
        active: true,
      });
      console.log('\n✓ Test developer user created!');
      console.log('   Email: developer@realestate.com');
      console.log('   Password: Developer@123456');
    }

    await mongoose.disconnect();
    console.log('\n✓ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
}

seedAdmin();
