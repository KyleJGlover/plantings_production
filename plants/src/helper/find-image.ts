import { gfs } from "../middleware/gridfs-image";
import { NotFoundError } from "@kgplantings/common";

//Needs to be overhauld to include Promises to display the images url

// Finds and appends the matching image. While also streaming the image url for the Front End
// Accepts: Plant Object
const findOneImage = async (plant) => {
  return new Promise(async function (resolve, reject) {
    const image = await gfs.find({ filename: plant.imageId });
    // Check if the file exists
    if (!image || image.length === 0) {
      return reject(new NotFoundError());
    }
    // returns the file name to response streams url allowing access on the browser
    return resolve({});
  });
};

export { findOneImage };
