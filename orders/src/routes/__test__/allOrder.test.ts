import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Plant } from "../../models/plant";
import mongoose from "mongoose";

const buildPlant = async () => {
  const plant = Plant.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "rose",
    price: 10,
  });
  await plant.save();

  return plant;
};

it("fetches orders for an particular user", async () => {
  // Create three tickets
  const plantOne = await buildPlant();
  const plantTwo = await buildPlant();
  const plantThree = await buildPlant();

  const userOne = global.signin();
  const userTwo = global.signin();
  // Create one order as User #1
  await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ plantId: plantOne.id })
    .expect(201);

  // Create two orders as User #2
  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ plantId: plantTwo.id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ plantId: plantThree.id })
    .expect(201);

  // Make request to get orders for User #2
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .expect(200);

  // Make sure we only got the orders for User #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].plant.id).toEqual(plantTwo.id);
  expect(response.body[1].plant.id).toEqual(plantThree.id);
});
