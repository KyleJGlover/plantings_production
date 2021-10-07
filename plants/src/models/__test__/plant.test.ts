import { Plant } from "../plant";

it("Implements optimisric concurrency control", async () => {
  // Create an instance of a plant
  const plant = Plant.build({
    title: "rose",
    description: "Beautiful",
    price: 10,
    userId: "asdf",
    imageFilename: "ndsicndwcnw",
  });

  // Save the plant to the database
  await plant.save();

  // Fetch the plant twice
  const firstInstance = await Plant.findById(plant.id);
  const secondInstance = await Plant.findById(plant.id);

  // Make two seperate changes to the plants we fetched
  firstInstance!.set({ price: 2 });
  secondInstance!.set({ price: 19 });

  // Save the first fetched palnt
  await firstInstance!.save();

  // Save the second fetched plant
  await secondInstance!.save();
});
