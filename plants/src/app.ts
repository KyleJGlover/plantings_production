import express from "express";
import "express-async-errors";

// Route imports
import { createPlantRouter } from "./routes/newPlant";
import { showPlantRouter } from "./routes/showPlant";
import { allPlantRouter } from "./routes/allPlants";
import { imageRouter } from "./routes/imagePlant";
import { updatePlantRouter } from "./routes/updatePlant";
import { deletePlantRouter } from "./routes/deletePlant";

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

app.use(createPlantRouter);
app.use(showPlantRouter);
app.use(allPlantRouter);
app.use(imageRouter);
app.use(updatePlantRouter);
app.use(deletePlantRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
