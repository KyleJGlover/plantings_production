import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Plant } from "../../models/plant";

it("fetches the order", async () => {
  // Create the Plant
  const plant = Plant.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await plant.save();

  const user = global.signin();
  // Make a request to build an order with this plant
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ plantId: plant.id })
    .expect(201);
  // Make request to fetch the order
  const { body: fetchOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);
  expect(fetchOrder.id).toEqual(order.id);
});

it("Invalid user attempts to access orders of another user, should return an error", async () => {
  // Create the Plant
  const plant = Plant.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await plant.save();

  const user = global.signin();
  const badUser = global.signin();
  // Make a request to build an order with this plant
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ plantId: plant.id })
    .expect(201);
  console.log(order.id);
  // Make request to fetch the order
  const { body: fetchOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", badUser)
    .send()
    .expect(401);
});
