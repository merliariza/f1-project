const calcWeatherFuelConsumption = function (baseConsumption, weather, downforce, tirePressure) {
    let increaseFactor = 1; // Factor de reducción de velocidad

    switch (weather.toLowerCase()) {
        case "seco":
            increaseFactor = 1; // No hay reducción
            break;
        case "lluvioso":
            increaseFactor = 1 + (Math.random() * (0.15 - 0.05) + 0.05); // Aumento entre 5% y 15% 
            break;
        case "extremo":
            increaseFactor = 1 + (Math.random() * (0.30 - 0.10) + 0.10); // Aumento entre 10% y 30% menos
            break;
        default:
            console.warn("Unknown weather, maintaining original consumption.");
    }

    // Ajuste por carga aerodinámica
    let aeroFactor = 1;
    switch (downforce.toLowerCase()) {
        case "baja":
            aeroFactor = (weather === "seco") ? 0.95 : 1.10; // En seco -5%, en lluvia/extremo +10%
            break;
        case "media":
            aeroFactor = 1; // Neutro
            break;
        case "alta":
            aeroFactor = (weather === "seco") ? 1.10 : 0.90; // En seco +10%, en lluvia/extremo -10%
            break;
    }

    // Ajuste por presión de neumáticos
    let tireFactor = 1;
    switch (tirePressure.toLowerCase()) {
        case "baja":
            tireFactor = (weather === "lluvioso" || weather === "extremo") ? 0.95 : 1.10; // -5% en lluvia/extremo, +10% en seco
            break;
        case "estandar":
            tireFactor = 1; // Neutro
            break;
        case "alta":
            tireFactor = (weather === "seco") ? 0.90 : 1.15; // -10% en seco, +15% en lluvia/extremo
            break;
    }

    // Calcular el consumo ajustado
    let newConsumption = baseConsumption * increaseFactor * aeroFactor * tireFactor;
    return parseFloat(newConsumption.toFixed(2)); // Redondeamos a 2 decimales
}

export default calcWeatherFuelConsumption;
