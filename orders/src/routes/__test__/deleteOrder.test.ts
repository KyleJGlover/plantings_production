import request from "supertest";
import { app } from "../../app";
import { Plant } from "../../models/plant";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";

it("Marks an order as cancelled (deleted)", async () => {
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
  // Make request to fetch then delete the order
  const { body: fetchOrder } = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  // Expects to make sure the thing is cancelled
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("It needs to emit a delete event", async () => {
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
  // Make request to fetch then delete the order
  const { body: fetchOrder } = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

// it("Invalid user attempts to access orders of another user, should return an error", async () => {
//     // Create the Plant
//     const plant = Plant.build({
//       title: "concert",
//       price: 20,
//     });
//     await plant.save();

//     const user = global.signin();
//     const badUser = global.signin();
//     // Make a request to build an order with this plant
//     const { body: order } = await request(app)
//       .post("/api/orders")
//       .set("Cookie", user)
//       .send({ plantId: plant.id })
//       .expect(201);
//     console.log(order.id);
//     // Make request to fetch the order
//     const { body: fetchOrder } = await request(app)
//       .get(`/api/orders/${order.id}`)
//       .set("Cookie", badUser)
//       .send()
//       .expect(401);
//   });
