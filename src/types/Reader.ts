
export type Reader = {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    registeredDate: string;
    createdAt?: string;
    updatedAt?: string;
};


export type ReaderFormData = {
    name: string;
    email: string;
    phone: string;
    address: string;
};