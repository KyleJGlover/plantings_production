import request from "supertest";
import { app } from "../../app";
import { Plant } from "../../models/plant";

it("Has a route ahndler listening to /api/plants for post request.", async () => {
  const response = await request(app).post("/api/plants").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in.", async () => {
  await request(app).post("/api/plants").send({}).expect(401);
});

it("Returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/plants")
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided.", async () => {
  await request(app)
    .post("/api/plants")
    .set("Cookie", global.signin())
    .send({
      title: "",
      description: "scnkcsjcnsdjk",
      price: 10,
      userId: 3,
    })
    .expect(400);

  await request(app)
    .post("/api/plants")
    .set("Cookie", global.signin())
    .send({
      title: "lcnwlkcn",
      description: "kbioij",
      price: 15,
      userId: 2,
    })
    .expect(400);
});

it("Creates a plant with valid inputs.", async () => {
  await request(app)
    .post("/api/plants")
    .set("Cookie", global.signin())
    .send({
      title: "lcnwlkcn",
      description: "cwcwcwcw",
      price: 15,
    })
    .expect(201);
});

it("Returns an error if an invalid price is provided.", async () => {
  await request(app)
    .post("/api/plants")
    .set("Cookie", global.signin())
    .send({
      title: "lcnwlkcn",
      description: "wdxcwcw",
    })
    .expect(400);

  await request(app)
    .post("/api/plants")
    .set("Cookie", global.signin())
    .send({
      title: "lcnwlkcn",
      description: "cwcwcwcw",
      price: -15,
    })
    .expect(400);
});
