import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Plant } from "../../models/plant";
import { natsWrapper } from "../../nats-wrapper";

it("returns an error if the plant does not exist", async () => {
  const plantId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ plantId })
    .expect(404);
});

it("returns an error if the plant is already reserved", async () => {
  const plant = Plant.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await plant.save();
  const order = Order.build({
    plant,
    userId: "laskdflkajsdf",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ plantId: plant.id })
    .expect(400);
});

it("reserves a plant", async () => {
  const plant = Plant.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "sunflower",
    price: 20,
  });
  await plant.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ plantId: plant.id })
    .expect(201);
});

it("emits an created event ", async () => {
  const plant = Plant.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "sunflower",
    price: 20,
  });
  await plant.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ plantId: plant.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
