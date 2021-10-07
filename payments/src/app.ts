import express from "express";
import "express-async-errors";

// Route imports
import { createChargeRouter } from "./routes/newCharge";

// Error Handling
import { errorHandler, NotFoundError, currentUser } from "@kgplantings/common";
import cookieSession from "cookie-session";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);

app.use(createChargeRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
