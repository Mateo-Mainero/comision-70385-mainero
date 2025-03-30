import ticketModel from "../models/ticket.js";

export class TicketsRepository {
    async createTicket(ticketData) {
        return await ticketModel.create(ticketData);
    }
}