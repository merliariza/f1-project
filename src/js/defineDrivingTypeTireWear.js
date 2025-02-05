const defineDrivingTypeTireWear = function (drivingType) {
    let tireWear;
    switch (drivingType.toLowerCase()) {
        case "saving":
            tireWear = 0.8;
            break;
        case "normal":
            tireWear = 1; // Sin reducción ni aumento
            break;
        case "aggressive":
            tireWear = 1.2;
            break;
        default:
            console.warn("Unknown driving type, using normal mode.");
            tireWear = 1;
    }

    return tireWear.toFixed(2); // Nueva aceleración considerando el estilo de conducción
}
export default defineDrivingTypeTireWear;
