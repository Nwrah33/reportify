import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
try {
  const user = await prisma.user.findUnique({ where: { email: 'nwrah3647@gmail.com' } });
  if (user) {
    console.log('User found:', user.email, user.role);
    console.log('Hash prefix:', user.passwordHash?.substring(0, 50));
    const match = await bcrypt.compare('Nwrah@123', user.passwordHash);
    console.log('Password match:', match);
  } else {
    console.log('User NOT found');
  }
  console.log('Total users:', await prisma.user.count());
} catch(e) { console.error(e); } finally { await prisma.$disconnect(); }
