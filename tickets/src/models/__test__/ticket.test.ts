import { Ticket } from "../ticket";

it("should throw an error if the documents are updated paralelly", async () => {

    // Build a ticket
    const ticket = Ticket.build({
        title: "Test",
        price: 2200,
        userId: "Test_ID"
    })
    await ticket.save()

    // Fetch the ticket twice
    const ticket1 = await Ticket.findById(ticket.id)
    const ticket2 = await Ticket.findById(ticket.id)

    // update the ticket first time and expect no errors
    ticket1!.set({ price: 4000 })
    await ticket1!.save()


    // update the ticket second time and expect it to throw error
    ticket2!.set({ price: 5000 })

    try {
        await ticket2!.save()
    } catch (err) {
        return
    }

    throw new Error("Should not reach this point")
})

it("impliments optimistic concurrency control", async () => {
    const ticket = Ticket.build({
        title: "Test",
        price: 2200,
        userId: "Test_ID"
    })
    await ticket.save()
    expect(ticket.version).toEqual(0)

    await ticket.save()
    expect(ticket.version).toEqual(1)

    await ticket.save()
    expect(ticket.version).toEqual(2)
})