export function calculateProrataAmount(
    startDate: Date, // Date d'entrée du copropriétaire
    saleDate: Date | null, // Date de sortie (null si toujours propriétaire)
    invoiceYear: number, // Année de la facture
    totalAmount: number, // Montant total de la facture
    numberOfCoOwners: number // Nombre total de copropriétaires à cette période
): number {
    const start = new Date(startDate);
    const end = saleDate ? new Date(saleDate) : new Date(`${invoiceYear}-12-31`); // Fin d'année si toujours propriétaire

    const invoiceStart = new Date(`${invoiceYear}-01-01`);
    const invoiceEnd = new Date(`${invoiceYear}-12-31`);

    // Déterminer la période de propriété effective durant l’année de la facture
    const effectiveStart = start > invoiceStart ? start : invoiceStart;
    const effectiveEnd = end < invoiceEnd ? end : invoiceEnd;

    if (effectiveStart > effectiveEnd) {
        return 0; // Le copropriétaire n'a pas été propriétaire cette année
    }

    // Nombre de jours de propriété durant l'année
    const ownershipDays = (effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24) + 1;
    const totalDaysInYear = (invoiceYear % 4 === 0) ? 366 : 365;

    // Calcul du prorata
    const prorataAmount = (ownershipDays / totalDaysInYear) * (totalAmount / numberOfCoOwners);

    return Math.round(prorataAmount * 100) / 100; // Arrondi à 2 décimales
}
