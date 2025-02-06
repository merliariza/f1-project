function generateRandomWeather() {
    const weathers = ["seco", "lluvioso", "extremo"];
    const randomIndex = Math.floor(Math.random() * weathers.length);
    return weathers[randomIndex];
}

export default generateRandomWeather;