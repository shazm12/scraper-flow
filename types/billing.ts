export enum PackId {
    SMALL="SMALL",
    MEDIUM="MEDIUM",
    LARGE="LARGE"
}


export type CreditsPack = {
    id: PackId;
    name: string;
    label: string;
    credits: number;
    price: number;
    priceId: string;
}


export const CreditsPacks: CreditsPack[] = [
    {
        id: PackId.SMALL,
        name: "Small Pack",
        label: "1000 credits",
        credits: 1000,
        price: 200,
        priceId: process.env.STRIPE_SMALL_PACK_PRICE_ID!
    },
        {
        id: PackId.MEDIUM,
        name: "Medium Pack",
        label: "5000 credits",
        credits: 5000,
        price: 500,
        priceId: process.env.STRIPE_MEDIUM_PACK_PRICE_ID!
    },        
    {
        id: PackId.LARGE,
        name: "Large Pack",
        label: "10000 credits",
        credits: 10000,
        price: 1000,
        priceId: process.env.STRIPE_LARGE_PACK_PRICE_ID!
    },
    

];


export const getCreditsPack = (id: PackId) => CreditsPacks.find(p => p.id === id);

