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
    const canBeAdded = !serviceObject.applicableIf
        || intersectArrays(state, serviceObject.applicableIf).length > 0;

    return !alreadyExists && canBeAdded ? [...state, service] : state;
}

function deselectAction(state: ServiceType[], service: ServiceType): ServiceType[] {
    const newState = state.filter(s => s !== service);
    const newStateObjects = mainServices.filter(s => newState.includes(s.type));
    const toRemove = newStateObjects
        .filter(
            s => s.applicableIf
            && intersectArrays(s.applicableIf, newState).length === 0)
        .map(s => s.type);

    return newState.filter(s => !toRemove.includes(s))
}

function intersectArrays(array1: ServiceType[], array2: ServiceType[]): ServiceType[] {
    return array1.filter(el => array2.includes(el));
}

export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear) => ({ basePrice: 0, finalPrice: 0 });

interface Service {
    type: ServiceType,
    price?: number,
    priceList?: PriceInYear[],
    applicableIf?: ServiceType[]
}

interface PriceInYear {
    year: number,
    price: number
}

const mainServices: Service[] =
[
    {type: "Photography", priceList: [{year: 2020, price: 1700},{year: 2021, price: 1800},{year:2022, price:1900}]},
    {type: "VideoRecording", priceList: [{year: 2020, price: 1700},{year: 2021, price: 1800},{year:2022, price:1900}]},
    //photo+video package: 2020: 2200, 2021: 2300, 2022: 2500
    {type: "WeddingSession", price: 600}, // 300 if video or photo; 0 if photo in 2022
    {type: "BlurayPackage", price: 300, applicableIf: ["VideoRecording"]},
    {type: "TwoDayEvent", price: 400, applicableIf: ["Photography", "VideoRecording"]}
]
