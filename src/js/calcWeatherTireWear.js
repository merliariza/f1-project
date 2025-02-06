const calcWeatherTireWear = function (baseWear, weather, downforce, tirePressure) {
    let wearFactor = 1;

    switch (weather.toLowerCase()) {
        case "seco":
            wearFactor = 1; // Desgaste normal
            break;
        case "lluvioso":
            wearFactor = 1 + (Math.random() * (0.15 - 0.05) + 0.05); // Aumento entre 5% y 15%
            break;
        case "extremo":
            wearFactor = 1 + (Math.random() * (0.30 - 0.10) + 0.10); // Aumento entre 10% y 30%
            break;
        default:
            console.warn("Unknown weather, maintaining original wear.");
    }

    // Ajuste por carga aerodinámica
    let aeroFactor = 1;
    switch (downforce.toLowerCase()) {
        case "baja":
            aeroFactor = (weather === "seco") ? 1 : 1.10; // En seco normal, en lluvia/extremo +10%
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

    // Calcular el desgaste ajustado
    let newWear = baseWear * wearFactor * aeroFactor * tireFactor;
    return parseFloat(newWear.toFixed(2)); // Redondeamos a 2 decimales

}

export default calcWeatherTireWear;
