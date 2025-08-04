"use server";

import { createMeal } from "@/lib/meals";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function invalidText(text) {
  return !text || text.trim() === "";
}

export async function shareMealAction(previousState,formData) {
  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
  };

  if (
    invalidText(meal.title) ||
    invalidText(meal.creator) ||
    invalidText(meal.summary) ||
    invalidText(meal.instructions) ||
    !meal.creator_email.includes("@") ||
    !meal.image ||
    meal.image.size === 0
  ) {
    
    return {
      message:"Invalid inputs",
    }
  }
  
  await createMeal(meal);
  revalidatePath('/meals')
  redirect("/meals");
}
