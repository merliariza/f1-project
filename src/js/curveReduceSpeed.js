const curveReduceSpeed= function (currentSpeed, weather, downforce, tirePressure) {
    let reduceFactor = 0.85; // Reducción base (15% menos de velocidad)
    
    // Ajuste por clima
    switch (weather.toLowerCase()) {
        case "seco":
            reduceFactor *= 1; // No hay reducción adicional
            break;
        case "lluvioso":
            reduceFactor *= 0.90; // Se reduce la velocidad en un 10%
            break;
        case "extremo":
            reduceFactor *= 0.80; // Se reduce la velocidad en un 20%
            break;
        default:
            console.warn("Unknown weather, maintaining default conditions.");
    }

    // Ajuste por carga aerodinámica
    switch (downforce.toLowerCase()) {
        case "baja":
            reduceFactor *= 0.85; // Se reduce la velocidad en un 15%
            break;
        case "media":
            reduceFactor *= 1; // No hay reducción adicional
            break;
        case "alta":
            reduceFactor *= 1.10; // Menos reducción de velocidad (+10%)
            break;
    }

    // Ajuste por presión de neumáticos
    switch (tirePressure.toLowerCase()) {
        case "baja":
            reduceFactor *= 1; // No hay reducción adicional
            break;
        case "estandar":
            reduceFactor *= 1.05; // Agarre óptimo → Menos reducción de velocidad (+5%)
            break;
        case "alta":
            reduceFactor *= 0.90; // Menos agarre → Se reduce más la velocidad (-10%)
            break;
    }

    let reducedSpeed = currentSpeed * reduceFactor;
    console.log("Reducción de la curva: " + reducedSpeed);
    return parseFloat(reducedSpeed.toFixed(2));
}

export default curveReduceSpeed;
