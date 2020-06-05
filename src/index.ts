export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType = "Photography" | "VideoRecording" | "BlurayPackage" | "TwoDayEvent" | "WeddingSession";

export const updateSelectedServices = (
    previouslySelectedServices: ServiceType[],
    action: { type: "Select" | "Deselect"; service: ServiceType }
) => {
    switch (action.type) {
        case "Select":
            return previouslySelectedServices.push(action.service);
        case "Deselect":
            let index = previouslySelectedServices.indexOf(action.service);
            return index > -1 ? previouslySelectedServices.splice(index, 1) : previouslySelectedServices;
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