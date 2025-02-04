const defineDrivingTypeTireWear = function (drivingType) {
    let tireWear;
    switch (drivingType.toLowerCase()) {
        case "saving":
            tireWear = 0.2;
            break;
        case "normal":
            tireWear = 0.5; // Sin reducción ni aumento
            break;
        case "aggressive":
            tireWear = 0.8;
            break;
        default:
            console.warn("Unknown driving type, using normal mode.");
            tireWear = 0.5;
    }

    return tireWear.toFixed(2); // Nueva aceleración considerando el estilo de conducción
}
export default defineDrivingTypeTireWear;
