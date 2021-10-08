import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@kgplantings/common";
import { createOrderRouter } from "./routes/newOrder";
import { showOrderRouter } from "./routes/showOrder";
import { allOrderRouter } from "./routes/allOrder";
import { deleteOrderRouter } from "./routes/deleteOrder";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

// Development version
// app.use(
//   cookieSession({
//     signed: false,
//     secure: process.env.NODE_ENV !== "test",
//   })
// );

app.use(currentUser);

app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(allOrderRouter);
app.use(deleteOrderRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
