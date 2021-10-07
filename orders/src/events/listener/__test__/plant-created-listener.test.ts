import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { PlantCreatedEvent } from "@kgplantings/common";
import { PlantCreatedListener } from "../plant-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Plant } from "../../../models/plant";

const setup = async () => {
  // create an instance of the listener
  const listener = new PlantCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: PlantCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "rose",
    description: "beautiful",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
    imageFilename: "dsncnscjk",
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates and saves a Plant", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a Plant was created!
  const plant = await Plant.findById(data.id);

  expect(plant).toBeDefined();
  expect(plant!.title).toEqual(data.title);
  expect(plant!.price).toEqual(data.price);
});

it("acks the message", async () => {
  const { data, listener, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
