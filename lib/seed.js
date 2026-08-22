import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { dbConnect } from './db.js';
import Admin from './models/Admin.js';
import Package from './models/Package.js';
import Destination from './models/Destination.js';
import Blog from './models/Blog.js';
import Review from './models/Review.js';
import Service from './models/Service.js';
import TeamMember from './models/TeamMember.js';

// Import static data to seed
const { 
  tourPackages, 
  destinationsList, 
  blogPosts, 
  teamMembers 
} = await import('../src/data/travelData.js');

const initialReviews = [
  {
    name: "Praveen Kumar",
    time: "2 weeks ago",
    rating: 5,
    trip: "Family Kerala Tour",
    category: "Family",
    text: "Booked our family Kerala tour (Munnar & Alleppey) with Spot Tours and Travels Coimbatore. Excellent vehicle condition, hygienic resorts, and punctual driver. The entire trip coordination was seamless and stress-free. Highly recommended in Kuniyamuthur!",
    approved: true,
    featured: true,
    order: 0
  },
  {
    name: "Ananya & Karthik",
    time: "a month ago",
    rating: 5,
    trip: "Bali Honeymoon Package",
    category: "Honeymoon",
    text: "We planned our honeymoon to Bali through Spot Tours and Travels. From flight ticketing and visa guidance to romantic candlelit dinner and private sightseeing, everything was executed flawlessly. Best travel agency in Coimbatore!",
    approved: true,
    featured: true,
    order: 1
  },
  {
    name: "Suresh Sundaram",
    time: "3 weeks ago",
    rating: 5,
    trip: "Rameswaram Temple Tour",
    category: "Pilgrimage",
    text: "Organized a spiritual pilgrimage trip to Rameswaram & Madurai for my elderly parents. The AC tourist cab was spotless and the driver was extremely patient and courteous with senior citizens. Truly 'The Spot For Needs'!",
    approved: true,
    featured: true,
    order: 2
  },
  {
    name: "Deepak Raj",
    time: "2 months ago",
    rating: 5,
    trip: "Goa Friends Vacation",
    category: "Friends",
    text: "Spot Tours and Travels gave us the best transparent pricing for our Goa trip with friends. No hidden charges, great resort right next to the beach, and constant support from their Coimbatore office.",
    approved: true,
    featured: true,
    order: 3
  },
  {
    name: "Divya Ramesh",
    time: "1 month ago",
    rating: 5,
    trip: "Ooty & Kodaikanal Tour",
    category: "Family",
    text: "Top-notch travel agency near Kuniyamuthur SBI Bank. Prompt train ticket reservations and a fantastic customized hill station itinerary. The resort stay in Ooty was breathtaking.",
    approved: true,
    featured: true,
    order: 4
  },
  {
    name: "Mohammed Farooq",
    time: "3 months ago",
    rating: 5,
    trip: "Dubai Holiday Package",
    category: "International",
    text: "Booked a Dubai holiday for our family. Smooth tourist visa processing, hotel stays, desert safari, and Burj Khalifa tickets. Spot Tours handled everything end-to-end with high professionalism.",
    approved: true,
    featured: true,
    order: 5
  }
];

const initialServices = [
  {
    title: "Domestic Tour Packages",
    description: "Customized holiday packages across India including Ooty, Kodaikanal, Kerala, Goa, Kashmir, Himachal, and Rajasthan.",
    iconKey: "plane",
    order: 0,
    active: true
  },
  {
    title: "International Holidays",
    description: "Exciting overseas vacation packages to Dubai, Bali, Singapore, Malaysia, Thailand, Sri Lanka, Maldives, and Europe.",
    iconKey: "globe",
    order: 1,
    active: true
  },
  {
    title: "Honeymoon Specials",
    description: "Romantic getaways with luxury resort stays, flower bed decoration, private sightseeing cabs, and candlelit dinners.",
    iconKey: "heart",
    order: 2,
    active: true
  },
  {
    title: "Pilgrimage & Temple Tours",
    description: "Curated spiritual journeys to Rameswaram, Madurai, Tirupati, Varanasi, Chidambaram, Navagraha, and Kumbakonam.",
    iconKey: "om",
    order: 3,
    active: true
  },
  {
    title: "AC Cab & Bus Rentals",
    description: "Comfortable sedans, Innova, Crysta, and Tempo Travelers for local Coimbatore transfers and outstation journeys.",
    iconKey: "car",
    order: 4,
    active: true
  },
  {
    title: "Flight & Train Ticketing",
    description: "Quick, hassle-free domestic & international flight ticketing, tatkal train booking assistance, and bus seat reservations.",
    iconKey: "ticket",
    order: 5,
    active: true
  },
  {
    title: "Visa & Passport Guidance",
    description: "End-to-end support for tourist visas, travel insurance, documentation, and passport appointment assistance.",
    iconKey: "passport",
    order: 6,
    active: true
  },
  {
    title: "Hotel & Resort Bookings",
    description: "Handpicked verified 3-star, 4-star, 5-star hotels, homestays, and jungle resorts with complimentary breakfast.",
    iconKey: "hotel",
    order: 7,
    active: true
  }
];

async function seed() {
  console.log('🌱 Seeding SpotTours database...');
  await dbConnect();

  // ── Admin ──────────────────────────────────────────────────────────────────
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const existing = await Admin.findOne({ email: adminEmail.toLowerCase() });
    if (!existing) {
      const hash = await bcrypt.hash(adminPassword, 12);
      await Admin.create({ email: adminEmail.toLowerCase(), passwordHash: hash, name: 'Senthil Nathan', role: 'admin' });
      console.log(`✅ Admin created: ${adminEmail}`);
    } else {
      console.log(`ℹ️  Admin already exists: ${adminEmail}`);
    }
  }

  // ── Packages ───────────────────────────────────────────────────────────────
  for (const pkg of tourPackages) {
    await Package.findOneAndUpdate({ id: pkg.id }, { ...pkg, active: true }, { upsert: true, setDefaultsOnInsert: true });
  }
  console.log(`✅ ${tourPackages.length} packages seeded`);

  // ── Destinations ───────────────────────────────────────────────────────────
  for (let i = 0; i < destinationsList.length; i++) {
    const d = destinationsList[i];
    await Destination.findOneAndUpdate({ id: d.id }, { ...d, order: i, active: true }, { upsert: true, setDefaultsOnInsert: true });
  }
  console.log(`✅ ${destinationsList.length} destinations seeded`);

  // ── Blogs ──────────────────────────────────────────────────────────────────
  for (const b of blogPosts) {
    await Blog.findOneAndUpdate({ slug: b.slug }, { ...b, active: true }, { upsert: true, setDefaultsOnInsert: true });
  }
  console.log(`✅ ${blogPosts.length} blogs seeded`);

  // ── Reviews ────────────────────────────────────────────────────────────────
  await Review.deleteMany({});
  await Review.insertMany(initialReviews);
  console.log(`✅ ${initialReviews.length} reviews seeded`);

  // ── Services ───────────────────────────────────────────────────────────────
  await Service.deleteMany({});
  await Service.insertMany(initialServices);
  console.log(`✅ ${initialServices.length} services seeded`);

  // ── Team Members ───────────────────────────────────────────────────────────
  await TeamMember.deleteMany({});
  for (let i = 0; i < teamMembers.length; i++) {
    await TeamMember.create({ ...teamMembers[i], order: i });
  }
  console.log(`✅ ${teamMembers.length} team members seeded`);

  console.log('🎉 Seed complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed error:', err.message);
  process.exit(1);
});
