const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = './screenshots';
const OUTPUT_FILE = './dist/output.png';
const IMAGES_PER_ROW = 10;

(async () => {
  // Read all the images in the directory
  const files = fs.readdirSync(IMAGES_DIR);

  // Load each image into a Jimp object
  const images = await Promise.all(files.map(async (file, index) => {
    const filePath = path.join(IMAGES_DIR, file);
    const image = await Jimp.read(filePath);
    console.log(`Loaded image ${index + 1}/${files.length}`);
    return image;
  }));

  // Calculate the number of rows needed
  const numRows = Math.ceil(images.length / IMAGES_PER_ROW);

  // Create a new Jimp image with the appropriate dimensions
  const output = new Jimp(images[0].getWidth() * IMAGES_PER_ROW, images[0].getHeight() * numRows);

  // Iterate over the images and paste them into the output image
  images.forEach((image, index) => {
    const row = Math.floor(index / IMAGES_PER_ROW);
    const col = index % IMAGES_PER_ROW;
    output.blit(image, col * image.getWidth(), row * image.getHeight());
    console.log(`Pasted image ${index + 1}/${images.length}`);
});

  // Save the output image
  await output.writeAsync(OUTPUT_FILE);
  console.log(`Saved output image to ${OUTPUT_FILE}`);
})();
