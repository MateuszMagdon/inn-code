export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType = "Photography" | "VideoRecording" | "BlurayPackage" | "TwoDayEvent" | "WeddingSession";

export const updateSelectedServices = (
    previouslySelectedServices: ServiceType[],
    action: { type: "Select" | "Deselect"; service: ServiceType }
) => {
    switch (action.type) {
        case "Select":
            return selectAction(previouslySelectedServices, action.service);
        case "Deselect":
            return deselectAction(previouslySelectedServices, action.service);
        default:
            return previouslySelectedServices;
    }
};

function selectAction(state: ServiceType[], service: ServiceType): ServiceType[] {
    const alreadyExists = state.includes(service);
    const serviceObject = mainServices.find(s => s.type === service);
    const canBeAdded = !serviceObject.requiredService
        || intersectArrays(state, serviceObject.requiredService).length > 0;

    return !alreadyExists && canBeAdded ? [...state, service] : state;
}

function deselectAction(state: ServiceType[], service: ServiceType): ServiceType[] {
    const newState = state.filter(s => s !== service);
    const newStateObjects = mainServices.filter(s => newState.includes(s.type));
    const toRemove = newStateObjects
        .filter(
            s => s.requiredService
            && intersectArrays(s.requiredService, newState).length === 0)
        .map(s => s.type);

    return newState.filter(s => !toRemove.includes(s))
}

function intersectArrays(array1: ServiceType[], array2: ServiceType[]): ServiceType[] {
    return array1.filter(el => array2.includes(el));
}

export const calculatePrice = (
    selectedServices: ServiceType[],
    selectedYear: ServiceYear
) => {
    let basePrice = 0;
    let finalPrice = basePrice;

    selectedServices.forEach(service => {
        const serviceObject = mainServices.find(s => s.type === service);
        const oridinalPrice = serviceObject.price ?
            serviceObject.price :
            serviceObject.priceList.find(p => p.year === selectedYear).price;

        basePrice += oridinalPrice;

        const applicableDiscounts = !serviceObject.discounts ? null
            : serviceObject.discounts
                .filter(
                    d => (!d.requiredYear || d.requiredYear === selectedYear)
                        && (!d.requiredService || selectedServices.includes(d.requiredService)));

        const discountedPrice = !applicableDiscounts || !(applicableDiscounts.length > 0) ?
            oridinalPrice
            : Math.min(...applicableDiscounts.map(d => d.price));

        finalPrice += discountedPrice;
    });

    return {basePrice: basePrice, finalPrice: finalPrice};
};

interface Service {
    type: ServiceType,
    price?: number,
    priceList?: PriceInYear[],
    requiredService?: ServiceType[],
    discounts?: Discount[]
}

interface PriceInYear {
    year: ServiceYear,
    price: number
}

interface Discount {
    price: number,
    requiredYear?: ServiceYear,
    requiredService: ServiceType
}

const mainServices: Service[] =
[
    {type: "Photography", priceList: [{year: 2020, price: 1700},{year: 2021, price: 1800},{year:2022, price:1900}]},
    {type: "VideoRecording", priceList: [{year: 2020, price: 1700},{year: 2021, price: 1800},{year:2022, price:1900}],
        discounts: [
        {price: 500, requiredYear: 2020, requiredService: "Photography"},
        {price: 500, requiredYear: 2021, requiredService: "Photography"},
        {price: 600, requiredYear: 2022, requiredService: "Photography"}]},
    {type: "WeddingSession", price: 600,
        discounts: [
        {price: 300, requiredService: "VideoRecording"},
        {price: 300, requiredService: "Photography"},
        {price: 0, requiredYear: 2022, requiredService: "Photography"}]},
    {type: "BlurayPackage", price: 300, requiredService: ["VideoRecording"]},
    {type: "TwoDayEvent", price: 400, requiredService: ["Photography", "VideoRecording"]}
]
