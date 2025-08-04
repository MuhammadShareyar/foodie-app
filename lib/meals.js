import fs from "node:fs";
import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";

const db = sql("meals.db");

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return db.prepare("SELECT * FROM meals").all();
}

export function getMeal(mealSlug) {
  return db.prepare("SELECT * FROM meals WHERE slug = ? ").get(mealSlug);
}

export async function createMeal(data) {
  data.slug = slugify(data.title, { lower: true });
  data.instructions = xss(data.instructions);

  const extension = data.image.name.split(".").pop();
  const fileName = `${data.slug}.${extension}`;

  const stream = fs.createWriteStream(`public/images/${fileName}`);
  const bufferedImage = await data.image.arrayBuffer();

  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error("Image saving failed!");
    }
  });

  data.image = `/images/${fileName}`;

  db.prepare(
    `
    INSERT INTO meals
      (title,summary,instructions,creator,creator_email,slug,image)
    VALUES (
      @title,
      @summary,
      @instructions,
      @creator,
      @creator_email,
      @slug,
      @image
    )
  `
  ).run(data);
}
