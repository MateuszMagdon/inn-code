export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType = "Photography" | "VideoRecording" | "BlurayPackage" | "TwoDayEvent" | "WeddingSession";

export const updateSelectedServices = (
    previouslySelectedServices: ServiceType[],
    action: { type: "Select" | "Deselect"; service: ServiceType }
) => {
    switch (action.type) {
        case "Select":
            return [...previouslySelectedServices, action.service];
        case "Deselect":
            return previouslySelectedServices.filter(s => s !== action.service);
        default:
            return previouslySelectedServices;
    }
};

export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear) => ({ basePrice: 0, finalPrice: 0 });

interface Service {
    type: ServiceType,
    prices: Price[]
}

interface Price {
    year: number,
    price: number
}

const store: Service[] =
[
    {type: "Photography", prices: [{year: 2020, price: 1700},{year: 2021, price: 1800},{year:2022, price:1900}]},
    {type: "VideoRecording", prices: [{year: 2020, price: 1700},{year: 2021, price: 1800},{year:2022, price:1900}]},
]