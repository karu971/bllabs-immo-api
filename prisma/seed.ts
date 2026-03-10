import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Compte démo (visitor) — compatibilité existante
  const demoPassword = process.env.E2E_SUPERADMIN_PASSWORD || '97169';
  await prisma.user.upsert({
    where: { email: 'gwachou' },
    update: { password: await bcrypt.hash(demoPassword, 10) },
    create: {
      email: 'gwachou',
      password: await bcrypt.hash(demoPassword, 10),
      role: 'VISITOR',
    },
  });

  // karu / karu971 — superadmin
  await prisma.user.upsert({
    where: { email: 'karu' },
    update: { password: await bcrypt.hash('karu971', 10), role: 'SUPERADMIN' },
    create: {
      email: 'karu',
      password: await bcrypt.hash('karu971', 10),
      role: 'SUPERADMIN',
    },
  });

  // yann / yann971 — admin
  await prisma.user.upsert({
    where: { email: 'yann' },
    update: { password: await bcrypt.hash('yann971', 10), role: 'ADMIN' },
    create: {
      email: 'yann',
      password: await bcrypt.hash('yann971', 10),
      role: 'ADMIN',
    },
  });

  console.log('Seed OK: gwachou (visitor), karu (superadmin), yann (admin).');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
