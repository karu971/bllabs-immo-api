import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const demoEmail = 'gwachou';
  const demoPassword = process.env.E2E_SUPERADMIN_PASSWORD || '97169';
  const hash = await bcrypt.hash(demoPassword, 10);

  await prisma.user.upsert({
    where: { email: demoEmail },
    update: { password: hash },
    create: {
      email: demoEmail,
      password: hash,
    },
  });

  console.log('Seed OK: user gwachou created/updated.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
