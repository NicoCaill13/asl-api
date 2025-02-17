import { Frequency } from '@prisma/client';

export const contracts = [
  {
    name: 'Allianz',
    utility: "Contrat d'assurance ASL",
    frequency: Frequency.YEARLY,
    lastPaymentDate: '2024-08-01T12:00:00Z',
    amount: 277,
  },
  {
    name: 'Engie',
    utility: "Contrat d'énergie",
    frequency: Frequency.MONTHLY,
    lastPaymentDate: '2024-10-01T12:00:00Z',
    amount: 54,
  },
  {
    name: 'APE',
    utility: 'Contrat de distribution eau',
    frequency: Frequency.HALF_YEARLY,
    lastPaymentDate: '2024-06-01T12:00:00Z',
    amount: 50,
  },
  {
    name: 'APA',
    utility: 'Maintenance des pompes de relevage',
    frequency: Frequency.YEARLY,
    lastPaymentDate: '2024-01-01T12:00:00Z',
    amount: 500,
  },
  {
    name: 'SAUR',
    utility: 'Maintenance des ouvrages d\'assainissement',
    frequency: Frequency.YEARLY,
    lastPaymentDate: '2024-01-01T12:00:00Z',
    amount: 500,
  },
];
