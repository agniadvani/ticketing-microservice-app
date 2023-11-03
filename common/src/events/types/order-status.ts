export enum OrderStatus {
    // When the order is created, but ticket is not 
    // reserved for payment
    Created = "created",

    // When the ticket is reserved or the user cancels 
    // the order or the order expires before payment
    Cancelled = "cancelled",

    // When the order has succesfully reserved the ticket
    AwaitingPayment = "awaiting:payment",

    // When the payment is completed for the order
    Complete = "complete"
}