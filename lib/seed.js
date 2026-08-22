import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { dbConnect } from './db.js';
import Admin from './models/Admin.js';
import Package from './models/Package.js';
import TeamMember from './models/TeamMember.js';

// Import static data to seed
const { tourPackages, teamMembers } = await import('../src/data/travelData.js');

async function seed() {
  console.log('🌱 Seeding SpotTours database...');
  await dbConnect();

  // ── Admin ──────────────────────────────────────────────────────────────────
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) throw new Error('Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env');

  const existing = await Admin.findOne({ email: adminEmail.toLowerCase() });
  if (!existing) {
    const hash = await bcrypt.hash(adminPassword, 12);
    await Admin.create({ email: adminEmail.toLowerCase(), passwordHash: hash, name: 'Senthil Nathan', role: 'admin' });
    console.log(`✅ Admin created: ${adminEmail}`);
  } else {
    console.log(`ℹ️  Admin already exists: ${adminEmail}`);
  }

  // ── Packages ───────────────────────────────────────────────────────────────
  let pkgCount = 0;
  for (const pkg of tourPackages) {
    await Package.findOneAndUpdate({ id: pkg.id }, { ...pkg, active: true }, { upsert: true, setDefaultsOnInsert: true });
    pkgCount++;
  }
  console.log(`✅ ${pkgCount} packages seeded`);

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
