import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { PlantUpdatedEvent } from "@kgplantings/common";
import { PlantUpdatedListener } from "../plant-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Plant } from "../../../models/plant";

const setup = async () => {
  // Create a listener
  const listener = new PlantUpdatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Plant.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  // Create a fake data object
  const data: PlantUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    imageFilename: "cmskocm",
    title: "new concert",
    description: "beautiful",
    price: 999,
    userId: "ablskdjf",
  };

  // Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all of this stuff
  return { msg, data, ticket, listener };
};

it("finds, updates, and saves a ticket", async () => {
  const { msg, data, ticket, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedPlant = await Plant.findById(ticket.id);

  expect(updatedPlant!.title).toEqual(data.title);
  expect(updatedPlant!.price).toEqual(data.price);
  expect(updatedPlant!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { msg, data, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
