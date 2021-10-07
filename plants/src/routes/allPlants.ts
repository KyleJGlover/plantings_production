import express, { Request, Response } from "express";
// Error handling
import { NotFoundError } from "@kgplantings/common";
// Helper function
import { findOneImage } from "../helper/find-image";
// Plant Model
import { Plant } from "../models/plant";

const router = express.Router();

const baseImageURL = "https://plantings.dev/api/plants/image/";

router.get("/api/plants", async (req: Request, res: Response) => {
  const plants = await Plant.find({
    orderId: undefined,
  });
  var result: any[] = [];
  if (plants.length > 0) {
    for (const plant of plants) {
      try {
        const error = await findOneImage(plant);

        // file name of the image url allowing access on the browser
        const URL = baseImageURL + plant.imageFilename;

        result.push({ plant, URL });
      } catch (error) {
        throw new NotFoundError();
      }
    }
  }

  res.send(result).status(200);
});

export { router as allPlantRouter };
