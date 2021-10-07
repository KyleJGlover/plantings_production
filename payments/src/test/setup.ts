import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import jwt from "jsonwebtoken";

declare global {
  var signin: (id?: string) => string[];
}

process.env.STRIPE_KEY =
  "sk_test_51Jfvl5CJT8qwobC5nA8iccmDBFadf26682kvDdNiBLtmhhjaDVnmCuslSLcD6J4U7vkSPUkKoQgtLvnhh1lui1TN00FMDeiu4l";

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "asdf1";

  mongo = await MongoMemoryServer.create();
  const uri = await mongo.getUri();

  await mongoose.connect(uri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // Build a JWT payload. { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build the object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take the JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // Return a string that the cookie with the encoded data
  return [`express:sess=${base64}`];
};
