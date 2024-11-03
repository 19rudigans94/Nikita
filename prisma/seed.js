import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const games = [
  {
    title: 'The Last of Us Part II',
    description: 'A thrilling action-adventure game set in a post-apocalyptic world.',
    imageUrl: 'https://images.unsplash.com/photo-1592155931584-901ac15763e3?auto=format&fit=crop&w=800&q=80',
    pricePerDay: 5.99,
    platform: 'PS5',
    available: true
  },
  {
    title: 'Halo Infinite',
    description: 'Master Chief returns in the biggest Halo adventure yet.',
    imageUrl: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=800&q=80',
    pricePerDay: 4.99,
    platform: 'Xbox Series X',
    available: true
  },
  {
    title: 'Super Mario Odyssey',
    description: 'Join Mario on a massive, globe-trotting 3D adventure.',
    imageUrl: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80',
    pricePerDay: 3.99,
    platform: 'Nintendo Switch',
    available: true
  }
];

async function seed() {
  try {
    console.log('Starting database seed...');

    // Clear existing data
    await prisma.rental.deleteMany();
    await prisma.game.deleteMany();

    // Insert games
    for (const game of games) {
      await prisma.game.create({
        data: game
      });
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();