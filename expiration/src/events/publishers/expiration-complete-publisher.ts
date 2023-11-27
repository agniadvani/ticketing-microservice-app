import { ExpirationCompleteEvent, Publisher, Subjects } from "@aggitix/common";


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}