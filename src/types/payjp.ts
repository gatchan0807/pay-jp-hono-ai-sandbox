export type ErrorResponse = {
    error: {
        code: string,
        message: string,
        param: string,
        status: number,
        type: string,
    }
}

export type CustomerResponse = {
    created: number,
    description: string | null,
    email: string | null,
    id: string,
    livemode: boolean,
    object: "customer",
}