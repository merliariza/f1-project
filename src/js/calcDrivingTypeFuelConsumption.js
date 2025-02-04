const calcDrivingTypeFuelConsumption = function (drivingType, baseFuelConsumption) {
    let fuelConsumptionFactor = 1;

    switch (drivingType.toLowerCase()) {
        case "saving":
            fuelConsumptionFactor = 1 - (Math.random() * (30 - 15) + 15) / 100; // -15% a -30%
            break;
        case "normal":
            fuelConsumptionFactor = 1; // Sin reducción ni aumento
            break;
        case "aggressive":
            fuelConsumptionFactor = 1 + (Math.random() * (25 - 10) + 10) / 100; // +10% a +25% de aumento
            break;
        default:
            console.warn("Unknown driving type, using normal mode.");
            fuelConsumptionFactor = 1;
    }

    // Calcular la nueva aceleración
    let adjustedFuelConsumption = baseFuelConsumption * fuelConsumptionFactor;

    return adjustedFuelConsumption.toFixed(2); // Nueva aceleración considerando el estilo de conducción
}
export default calcDrivingTypeFuelConsumption;