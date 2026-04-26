import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding products...');

    await prisma.product.deleteMany(); // wipe on re-seed

    await prisma.product.createMany({
        data: [
            {
                id: '97e14571-ba36-4a50-9bf6-a17e7586425c',
                name: 'Engraved Barn Sign',
                price: 10417,
                quantity: 76,
                slug: 'engraved-barn-sign',
                description: 'Engraved Barn Sign with premium quality and custom design.',
                tags: ['wood'],
                image: '/logo_banner.png',
            },
            {
                id: '760b4fbe-9415-4649-bce2-3030cb3f7d6c',
                name: 'Vintage Cutting Board',
                price: 810,
                quantity: 75,
                slug: 'vintage-cutting-board',
                description: 'Vintage Cutting Board with premium quality and custom design.',
                tags: ['custom'],
                image: '/logo_banner.png',
            },
            {
                id: '7b7665f2-70ca-40e1-8b6c-27ad45ee0638',
                name: 'Vintage Tray',
                price: 11624,
                quantity: 18,
                slug: 'vintage-tray',
                description: 'Vintage Tray with premium quality and custom design.',
                tags: ['custom', 'decor'],
                image: '/logo_banner.png',
            },
            // ... continue for remaining products
        ],
        skipDuplicates: true,
    });

    console.log('Seeding complete.');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());