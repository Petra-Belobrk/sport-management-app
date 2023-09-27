import { RoleType } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import * as process from 'process';

const roles = [
  {
    name: 'Admin',
    type: RoleType.ADMIN,
  },
  {
    name: 'User',
    type: RoleType.USER,
  },
];

const prisma = new PrismaClient();

async function main(): Promise<void> {
  for (const role of roles) {
    await prisma.role.upsert({
      create: { ...role },
      update: { ...role },
      where: { type: role.type },
    });
  }
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
