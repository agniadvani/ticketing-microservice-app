export const stripe = {
    paymentIntents: {
        create: jest.fn().mockReturnValue({ id: "TEST" })
    }
}