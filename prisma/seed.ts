import { Frequency, PrismaClient, Role, Utility } from '@prisma/client';
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

  const fakeOwners = [
    {
      id: 1,
      name: 'Lot 101',
      emailMain: 'demo1@asl.com',
      address: 'Default Address',
      lotNumber: 101,
      bankBalance: 0,
      city: 'Default City',
      zipCode: '00000',
      phone: '000-000-0000',
      officeId: 1,
      acquisitionDate: new Date(),
    },
    {
      id: 2,
      name: 'Lot 102',
      emailMain: 'demo2@asl.com',
      address: 'Default Address',
      lotNumber: 102,
      bankBalance: 0,
      city: 'Default City',
      zipCode: '00000',
      phone: '000-000-0000',
      officeId: 1,
      acquisitionDate: new Date(),
    },
    {
      id: 3,
      name: 'Lot 103',
      emailMain: 'demo3@asl.com',
      address: 'Default Address',
      lotNumber: 103,
      bankBalance: 0,
      city: 'Default City',
      zipCode: '00000',
      phone: '000-000-0000',
      officeId: 1,
      acquisitionDate: new Date(),
    },
    {
      id: 4,
      name: 'Lot 104',
      emailMain: 'demo4@asl.com',
      address: 'Default Address',
      lotNumber: 104,
      bankBalance: 0,
      city: 'Default City',
      zipCode: '00000',
      phone: '000-000-0000',
      officeId: 1,
      acquisitionDate: new Date(),
    },
    {
      id: 5,
      name: 'Lot 105',
      emailMain: 'demo5@asl.com',
      address: 'Default Address',
      lotNumber: 105,
      bankBalance: 0,
      city: 'Default City',
      zipCode: '00000',
      phone: '000-000-0000',
      officeId: 1,
      acquisitionDate: new Date(),
    },
    {
      id: 6,
      name: 'Lot 106',
      emailMain: 'demo6@asl.com',
      address: 'Default Address',
      lotNumber: 106,
      bankBalance: 0,
      city: 'Default City',
      zipCode: '00000',
      phone: '000-000-0000',
      officeId: 1,
      acquisitionDate: new Date(),
    },
    {
      id: 7,
      name: 'Lot 107',
      emailMain: 'demo7@asl.com',
      address: 'Default Address',
      lotNumber: 107,
      bankBalance: 0,
      city: 'Default City',
      zipCode: '00000',
      phone: '000-000-0000',
      officeId: 1,
      acquisitionDate: new Date(),
    },
  ];

  for (const owner of fakeOwners) {
    await prisma.coOwnership.upsert({
      where: { emailMain: owner.emailMain },
      update: {},
      create: owner,
    });
  }
}

const roundsOfHashing = parseInt(process.env.ROUNDS_OF_HASHING!);

async function handleCoOwners() {
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
        acquisitionDate: element.acquisitionDate,
      },
    });
  }
}

async function runSeed() {
  await handleCoOwners();

  for (let index = 0; index < contracts.length; index++) {
    const contract = contracts[index];
    await prisma.contract.upsert({
      where: { id: index + 1 },
      update: {},
      create: {
        name: contract.name,
        utility: contract.utility as Utility,
        frequency: contract.frequency as Frequency,
        lastPaymentDate: contract.lastPaymentDate,
        amount: contract.amount,
      },
    });
  }

  await main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

runSeed();
