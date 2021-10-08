import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { OrderStatus } from "@kgplantings/common";
import { Payment } from "../../models/payments";

import { stripe } from "../../stripe";

it("returns an 401 error when purchasing an order that does not exist", async () => {
  return request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "test",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that doesn't belong to the user ", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 30,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "test",
      orderId: order.id,
    })
    .expect(401);
});

it("returns a 400 when purchasing an cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 30,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "test",
      orderId: order.id,
    })
    .expect(400);
});

// it("returns a 201 when purchasing with valid order and user ID", async () => {
//   const price = Math.floor(Math.random() * 100000);
//   const userId = new mongoose.Types.ObjectId().toHexString();
//   const order = Order.build({
//     id: new mongoose.Types.ObjectId().toHexString(),
//     userId,
//     version: 0,
//     price,
//     status: OrderStatus.Created,
//   });
//   console.log(order.id);
//   await order.save();

//   await request(app)
//     .post("/api/payments")
//     .set("Cookie", global.signin(userId))
//     .send({
//       token: "tok_visa",
//       orderId: order.id,
//     })
//     .expect(201);

//   const stripeCharges = await stripe.charges.list({ limit: 50 });

//   const stripeCharge = stripeCharges.data.find((charge) => {
//     return charge.amount === price * 100;
//   });

//   expect(stripeCharge).toBeDefined();
//   expect(stripeCharge!.currency).toEqual("usd");

//   const payment = await Payment.findOne({
//     orderId: order.id,
//     stripeId: stripeCharge!.id,
//   });

//   expect(payment).not.toBeNull();
// });
