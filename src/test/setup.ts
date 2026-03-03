import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

import { prisma } from '../prisma.client.js';

beforeEach(async () => {
    await prisma.todo.deleteMany();
});

afterAll(async () => {
    await prisma.$disconnect();
});