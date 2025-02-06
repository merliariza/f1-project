const defineDrivingTypeTireWear = function (drivingType) {
    switch (drivingType.toLowerCase()) {
        case "ahorro":
            tireWear = 0.8;
            break;
        case "normal":
            tireWear = 1; // Sin reducción ni aumento
            break;
        case "agresiva":
            tireWear = 1.2;
            break;
        default:
            console.warn("Unknown driving type, using normal mode.");
            tireWear = 1;
    }

    return parseFloat(tireWear.toFixed(2)); // Nueva aceleración considerando el estilo de conducción
}
export default defineDrivingTypeTireWear;
