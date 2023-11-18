import { Subjects } from "./subjects";


export interface OrderCancelledEvent {
    subject: Subjects.OrderCancelled;

    data: {
        id: string;
        version: string;
        ticket: {
            id: string;
        }
    }
}