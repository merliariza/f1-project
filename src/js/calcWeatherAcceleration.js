const calcWeatherAcceleration = function (baseAcceleration, weather, downforce, tirePressure) {
    let reductionFactor = 1; // Factor de reducción de velocidad

    switch (weather.toLowerCase()) {
        case "seco":
            reductionFactor = 1; // No hay reducción
            break;
        case "lluvioso":
            reductionFactor = 1 - (Math.random() * (0.30 - 0.15) + 0.15); // Entre 15% y 30% menos
            break;
        case "extremo":
            reductionFactor = 1 - (Math.random() * (0.50 - 0.30) + 0.30); // Entre 30% y 50% menos
            break;
        default:
            console.warn("Unknown weather, maintaining original aceleration.");
    }
    // Ajuste por carga aerodinámica
    let aeroFactor = 1;
    switch (downforce.toLowerCase()) {
        case "baja":
            aeroFactor = (weather === "seco") ? 1.05 : 0.90; // En seco +5%, en lluvia/extremo -10%
            break;
        case "media":
            aeroFactor = 1; // Neutro
            break;
        case "alta":
            aeroFactor = (weather === "seco") ? 0.95 : 1.10; // En seco -5%, en lluvia/extremo +10%
            break;
    }

    // Ajuste por presión de neumáticos
    let tireFactor = 1;
    switch (tirePressure.toLowerCase()) {
        case "baja":
            tireFactor = (weather === "lluvioso" || weather === "extremo") ? 1.10 : 0.95; // +10% en lluvia/extremo, -5% en seco
            break;
        case "estandar":
            tireFactor = 1; // Neutro
            break;
        case "alta":
            tireFactor = (weather === "seco") ? 1.05 : 0.90; // +5% en seco, -10% en lluvia/extremo
            break;
    }

    // Calcular la aceleración ajustada
    let newAcceleration = baseAcceleration * reductionFactor * aeroFactor * tireFactor;
    return parseFloat(newAcceleration.toFixed(2)); // Redondeamos a 2 decimales
} 

export default calcWeatherAcceleration;
