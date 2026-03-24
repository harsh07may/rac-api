import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'fs/promises';
import { PrismaClient } from '../prisma/generated/prisma/client.js';
import { envConfig } from '../src/config/envConfig.js';

const connectionString = `${envConfig.DATABASE_URL}`;
const adapter = new PrismaPg({
  connectionString: connectionString,
});
const prisma = new PrismaClient({ adapter });


async function  seedRolesAndPermissions() {
  console.log('--- Seeding Roles & Permissions ---');
  const permissions = [
    'read:vehicles', 'create:vehicles', 'update:vehicles', 'delete:vehicles',
    'read:bookings', 'create:bookings', 'update:bookings', 'delete:bookings',
    'manage:users', 'manage:agencies', 'manage:fleet'
  ];

  await Promise.all(
    permissions.map(action =>
      prisma.permission.upsert({
        where: { action },
        update: {},
        create: { action },
      })
    )
  );

  const roles = [
    { name: 'ADMIN', permissions: permissions },
    { name: 'AGENCY_MANAGER', permissions: ['read:vehicles', 'create:vehicles', 'update:vehicles', 'read:bookings', 'update:bookings', 'manage:fleet'] },
    { name: 'DRIVER', permissions: ['read:bookings'] },
    { name: 'CUSTOMER', permissions: ['read:vehicles', 'create:bookings', 'read:bookings'] },
  ];

  for (const roleData of roles) {
    await prisma.role.upsert({
      where: { name: roleData.name },
      update: {},
      create: { 
        name: roleData.name,
        permissions: {
          connect: roleData.permissions.map(p => ({ action: p }))
        }
      },
    });
    console.log(`✅ Role seeded: ${roleData.name}`);
  }
}

async function seedGeography() {
  console.log('--- Seeding Geography ---');
  try {
    const existingCountries = await prisma.country.count();
    if (existingCountries < 50) {
      console.log('Seeding bulk geographical data. This might take a minute...');
      const countriesData = JSON.parse(await fs.readFile(new URL('./data/countries.json', import.meta.url), 'utf-8'));
      const countryInserts = countriesData
        .map((c: any) => ({ name: c.name, code: c.iso2 }))
        .filter((c: any) => c.name && c.code);

      await prisma.country.createMany({
        data: countryInserts,
        skipDuplicates: true
      });
      console.log(`✅ ${countryInserts.length} Countries seeded`);

      // Load active countries into memory to map ISO2 codes to Prisma UUIDs
      const dbCountries = await prisma.country.findMany();
      const countryMap = new Map(dbCountries.map(c => [c.code, c.id]));

      const statesData = JSON.parse(await fs.readFile(new URL('./data/states.json', import.meta.url), 'utf-8'));
      const stateInserts = statesData
        .map((s: any) => ({ name: s.name, countryId: countryMap.get(s.country_code) }))
        .filter((s: any) => s.countryId);

      const chunkSize = 5000;
      for (let i = 0; i < stateInserts.length; i += chunkSize) {
        await prisma.region.createMany({
          data: stateInserts.slice(i, i + chunkSize),
          skipDuplicates: true
        });
      }
      console.log(`✅ ${stateInserts.length} Regions seeded`);

      console.log('Loading cities.json (this may take a few seconds)...');
      const citiesData = JSON.parse(await fs.readFile(new URL('./data/cities.json', import.meta.url), 'utf-8'));
      const cityInserts = citiesData
        .map((c: any) => ({ name: c.name, countryId: countryMap.get(c.country_code) }))
        .filter((c: any) => c.countryId);

      for (let i = 0; i < cityInserts.length; i += chunkSize) {
        await prisma.city.createMany({
          data: cityInserts.slice(i, i + chunkSize),
          skipDuplicates: true
        });
      }
      console.log(`✅ ${cityInserts.length} Cities seeded`);
    } else {
      console.log('✅ Geography already seeded. Skipping bulk operation.');
    }
  } catch(e: any) {
    console.error('Failed to seed geographic data. Please ensure data/*.json files exist.', e.message || e);
  }
}

async function seedFleetCatalog() {
  console.log('--- Seeding Fleet Catalog ---');
  const categories = ['Economy', 'Compact', 'SUV', 'Luxury', 'Convertible', 'Van'];
  await Promise.all(
    categories.map(name => 
      prisma.vehicleCategory.upsert({
        where: { name },
        update: {},
        create: { name }
      })
    )
  );
  console.log('✅ Categories seeded');

  const fleetData = [
    { make: 'Toyota', models: ['Camry', 'Corolla', 'Land Cruiser', 'Yaris'] },
    { make: 'Nissan', models: ['Patrol', 'Sunny', 'Altima', 'Kicks'] },
    { make: 'Ford', models: ['Mustang', 'Explorer', 'Edge'] },
    { make: 'Tesla', models: ['Model 3', 'Model Y', 'Model S'] },
    { make: 'Mercedes-Benz', models: ['C-Class', 'E-Class', 'G-Class'] },
    { make: 'BMW', models: ['3 Series', '5 Series', 'X5'] },
    { make: 'Audi', models: ['A4', 'A6', 'Q7'] },
  ];

  for (const makeData of fleetData) {
    const make = await prisma.vehicleMake.upsert({
      where: { name: makeData.make },
      update: {},
      create: { name: makeData.make }
    });

    for (const modelName of makeData.models) {
      const existingModel = await prisma.vehicleModel.findFirst({
        where: { name: modelName, makeId: make.id }
      });
      if (!existingModel) {
        await prisma.vehicleModel.create({
          data: { name: modelName, makeId: make.id }
        });
      }
    }
    console.log(`✅ Make & Models seeded: ${makeData.make}`);
  }

  const features = ['Automatic', 'Manual', 'Bluetooth', 'GPS', 'Leather Seats', 'Sunroof', 'Apple CarPlay', 'Android Auto', 'Backup Camera', 'Cruise Control'];
  await Promise.all(
    features.map(name => 
      prisma.feature.upsert({
        where: { name },
        update: {},
        create: { name }
      })
    )
  );
  console.log('✅ Features seeded');
}

async function seedAddons() {
  console.log('--- Seeding Addons ---');
  const addons = [
    { name: 'Child Seat', price: 25.00, description: 'ISOFIX compatible child safety seat' },
    { name: 'GPS Navigation', price: 15.00, description: 'Stand-alone GPS navigation unit' },
    { name: 'Additional Driver', price: 50.00, description: 'Allows an additional driver to operate the vehicle' },
    { name: 'Premium Insurance Cover', price: 100.00, description: 'Zero liability premium insurance cover' },
    { name: 'Roadside Assistance', price: 20.00, description: '24/7 priority roadside assistance' },
  ];

  for (const addon of addons) {
    const existingAddon = await prisma.addon.findFirst({
      where: { name: addon.name }
    });
    if (!existingAddon) {
      await prisma.addon.create({
        data: addon
      });
      console.log(`✅ Addon seeded: ${addon.name}`);
    }
  }
}

async function seed() {
  console.log('🌱 Starting comprehensive configuration seed...');
  await seedRolesAndPermissions();
  await seedGeography();
  // await seedFleetCatalog();
  // await seedAddons();
  console.log('🚀 Seed complete!');
}



seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
