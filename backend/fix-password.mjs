import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
try {
  const hash = await bcrypt.hash('Nwrah@123', 12);
  const user = await prisma.user.update({
    where: { email: 'nwrah3647@gmail.com' },
    data: { passwordHash: hash, role: 'SUPER_ADMIN', emailVerified: true },
  });
  console.log('Updated user:', user.email, user.role);
  const match = await bcrypt.compare('Nwrah@123', user.passwordHash);
  console.log('Password match:', match);
} catch(e) { console.error(e); } finally { await prisma.$disconnect(); }
