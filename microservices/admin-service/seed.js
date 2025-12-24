/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const filterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  description: String,
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Filter = mongoose.model('Filter', filterSchema);

const seedData = [
  // Property Types
  {
    name: 'Residential',
    category: 'property-type',
    description: 'Residential properties',
    isActive: true,
    order: 1,
  },
  {
    name: 'Commercial',
    category: 'property-type',
    description: 'Commercial properties',
    isActive: true,
    order: 2,
  },
  {
    name: 'Apartment',
    category: 'property-type',
    description: 'Apartment units',
    isActive: true,
    order: 3,
  },
  {
    name: 'Villa',
    category: 'property-type',
    description: 'Villa properties',
    isActive: true,
    order: 4,
  },
  {
    name: 'House',
    category: 'property-type',
    description: 'Single family house',
    isActive: true,
    order: 5,
  },
  {
    name: 'Penthouse',
    category: 'property-type',
    description: 'Penthouse units',
    isActive: true,
    order: 6,
  },

  // Amenities
  {
    name: 'Pool',
    category: 'amenities',
    description: 'Swimming pool',
    isActive: true,
    order: 1,
  },
  {
    name: 'Gym',
    category: 'amenities',
    description: 'Fitness center',
    isActive: true,
    order: 2,
  },
  {
    name: 'Security',
    category: 'amenities',
    description: 'Security system',
    isActive: true,
    order: 3,
  },
  {
    name: 'Parking',
    category: 'amenities',
    description: 'Parking space',
    isActive: true,
    order: 4,
  },
  {
    name: 'Garden',
    category: 'amenities',
    description: 'Garden area',
    isActive: true,
    order: 5,
  },
  {
    name: 'Balcony',
    category: 'amenities',
    description: 'Balcony or terrace',
    isActive: true,
    order: 6,
  },

  // Features
  {
    name: 'Air Conditioning',
    category: 'features',
    description: 'Air conditioning system',
    isActive: true,
    order: 1,
  },
  {
    name: 'Internet',
    category: 'features',
    description: 'Internet connection',
    isActive: true,
    order: 2,
  },
  {
    name: 'Electricity',
    category: 'features',
    description: 'Electricity supply',
    isActive: true,
    order: 3,
  },
  {
    name: 'Water',
    category: 'features',
    description: 'Water supply',
    isActive: true,
    order: 4,
  },
  {
    name: 'Gas',
    category: 'features',
    description: 'Gas supply',
    isActive: true,
    order: 5,
  },
  {
    name: 'Wifi',
    category: 'features',
    description: 'WiFi internet',
    isActive: true,
    order: 6,
  },
  {
    name: 'Furnished',
    category: 'features',
    description: 'Furnished property',
    isActive: true,
    order: 7,
  },
  {
    name: 'Yard',
    category: 'features',
    description: 'Yard space',
    isActive: true,
    order: 8,
  },
  {
    name: 'Pets Allowed',
    category: 'features',
    description: 'Pets allowed',
    isActive: true,
    order: 9,
  },
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/real-estate-admin';
    
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    // Clear existing filters
    const deletedCount = await Filter.deleteMany({});
    console.log(`✓ Cleared ${deletedCount.deletedCount} existing filters`);

    // Insert new filters
    const result = await Filter.insertMany(seedData);
    console.log(`✓ Inserted ${result.length} filters into database`);

    // List inserted filters
    console.log('\n📋 Filters by Category:');
    const categories = ['property-type', 'amenities', 'features'];
    
    for (const category of categories) {
      const filters = await Filter.find({ category }).sort({ order: 1 });
      console.log(`\n${category.toUpperCase()}:`);
      filters.forEach((filter) => {
        console.log(`  • ${filter.name} (Order: ${filter.order})`);
      });
    }

    console.log('\n✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
