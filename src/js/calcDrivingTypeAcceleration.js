const calcDrivingTypeAcceleration = function (drivingType, baseAcceleration) {
    let accelerationFactor = 1;

    switch (drivingType.toLowerCase()) {
        case "ahorro":
            accelerationFactor = 1 - (Math.random() * (15 - 5) + 5) / 100; // -5% a -15%
            break;
        case "normal":
            accelerationFactor = 1; // Sin reducción ni aumento
            break;
        case "agresiva":
            accelerationFactor = 1 + (Math.random() * (15 - 5) + 5) / 100; // +5% a +15% de aumento
            break;
        default:
            console.warn("Unknown driving type, using normal mode.");
            accelerationFactor = 1;
    }

    // Calcular la nueva aceleración
    let adjustedAcceleration = baseAcceleration * accelerationFactor;

    return parseFloat(adjustedAcceleration.toFixed(2)); // Nueva aceleración considerando el estilo de conducción
}

export default calcDrivingTypeAcceleration;
