import { PrismaClient, Role } from '@prisma/client';
import { coOwner } from './seeders/coOwner';
import * as bcrypt from 'bcrypt';
import { contracts } from './seeders/contracts';

const prisma = new PrismaClient();

async function main() {
  await prisma.office.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'ASL campagne jeanne',
      totalLot: 14,
      email: 'campagnejeanne549@gmail.com',
      bankAccountNumber: '124588966ddd',
      bankBalance: 2600,
    },
  });

  const roundsOfHashing = parseInt(process.env.ROUNDS_OF_HASHING!);

  const passwordDefault = await bcrypt.hash(process.env.PASSWORD_DEFAULT!, roundsOfHashing);

  for (let index = 0; index < coOwner.length; index++) {
    const element = coOwner[index];
    await prisma.coOwnership.upsert({
      where: { id: index + 1 },
      update: {
        password: passwordDefault,
      },
      create: {
        role: element.role as unknown as Role,
        name: element.name,
        address: element.address,
        emailMain: element.emailMain,
        emailOpt: element.emailOpt,
        lotNumber: element.lotNumber,
        bankBalance: element.bankBalance,
        city: element.city,
        zipCode: element.zipCode,
        phone: element.phone,
        officeId: element.officeId,
        password: passwordDefault,
        acquisitionDate: element.acquisitionDate

      },
    });
  }

  for (let index = 0; index < contracts.length; index++) {
    const contract = contracts[index];
    await prisma.contract.upsert({
      where: { id: index + 1 },
      update: {},
      create: {
        name: contract.name,
        utility: contract.utility,
        frequency: contract.frequency,
        lastPaymentDate: contract.lastPaymentDate,
        amount: contract.amount,
      },
    });
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
