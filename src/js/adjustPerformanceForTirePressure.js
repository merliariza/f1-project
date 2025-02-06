function adjustPerformanceForTirePressure(adjustment, maxSpeed, acceleration, fuelConsumption, tireWear) {
    let adjustedMaxSpeed, adjustedAcceleration, adjustedFuelConsumption, adjustedTireWear;

    switch (adjustment.toLowerCase()) {
        case "baja":
            adjustedMaxSpeed = maxSpeed * 0.95; // -5% velocidad
            adjustedAcceleration = acceleration * 1.05; // +5% aceleración
            adjustedFuelConsumption = fuelConsumption * 1.1; // +10% consumo
            adjustedTireWear = tireWear * 1.2; // +20% desgaste
            break;
        case "estandar":
            adjustedMaxSpeed = maxSpeed; // Sin cambios
            adjustedAcceleration = acceleration;
            adjustedFuelConsumption = fuelConsumption;
            adjustedTireWear = tireWear;
            break;
        case "alta":
            adjustedMaxSpeed = maxSpeed * 1.05; // +5% velocidad
            adjustedAcceleration = acceleration * 0.95; // -5% aceleración
            adjustedFuelConsumption = fuelConsumption * 0.9; // -10% consumo
            adjustedTireWear = tireWear * 0.8; // -20% desgaste
            break;
        default:
            console.warn("Tire adjustment unknown, using estandar.");
            adjustedMaxSpeed = maxSpeed;
            adjustedAcceleration = acceleration;
            adjustedFuelConsumption = fuelConsumption;
            adjustedTireWear = tireWear;
    }

    return {
        maxSpeed: parseFloat(adjustedMaxSpeed.toFixed(2)),
        acceleration: parseFloat(adjustedAcceleration.toFixed(2)),
        fuelConsumption: parseFloat(adjustedFuelConsumption.toFixed(2)),
        tireWear: parseFloat(adjustedTireWear.toFixed(2))
    };
}

export default adjustPerformanceForTirePressure;