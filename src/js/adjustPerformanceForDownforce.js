const adjustPerformanceForDownforce = function (downforce, maxSpeed, acceleration, fuelConsumption, tireWear) {
    let adjustedMaxSpeed, adjustedAcceleration, adjustedFuelConsumption, adjustedTireWear;
    // Ajustes según la carga aerodinámica
    switch (downforce.toLowerCase()) {
        case "baja":
            adjustedMaxSpeed = maxSpeed * 1.05; // Aumento de 5% en velocidad máxima
            adjustedAcceleration = acceleration * 1.05; // Mejora de aceleración
            adjustedFuelConsumption = fuelConsumption * 0.95; // Menor consumo en pistas rápidas
            adjustedTireWear = tireWear * 0.9; // Desgaste menor
            break;
        case "media":
            adjustedMaxSpeed = maxSpeed; // Sin cambios
            adjustedAcceleration = acceleration; // Sin cambios
            adjustedFuelConsumption = fuelConsumption; // Consumo base
            adjustedTireWear = tireWear; // Desgaste base
            break;
        case "alta":
            adjustedMaxSpeed = maxSpeed * 0.95; // Reducción de 5% en velocidad máxima
            adjustedAcceleration = acceleration * 0.95; // Reducción de aceleración
            adjustedFuelConsumption = fuelConsumption * 1.1; // Mayor consumo
            adjustedTireWear = tireWear * 1.1; // Mayor desgaste
            break;
        default:
            console.warn("Unknown downforce, using media load.");
            adjustedMaxSpeed = maxSpeed;
            adjustedAcceleration = acceleration;
            adjustedFuelConsumption = fuelConsumption;
            adjustedTireWear = tireWear;
    }

    return {
        maxSpeed:parseFloat(adjustedMaxSpeed.toFixed(2)),
        acceleration:parseFloat(adjustedAcceleration.toFixed(2)),
        fuelConsumption:parseFloat(adjustedFuelConsumption.toFixed(2)),
        tireWear:parseFloat(adjustedTireWear.toFixed(2)),
    };
}

export default adjustPerformanceForDownforce;
