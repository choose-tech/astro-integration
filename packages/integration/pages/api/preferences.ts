import type { APIRoute } from "astro";
import { Preferences } from "../../utils/preferences";

export const POST: APIRoute = async ({ redirect, request, cookies }) => {
  const data = await request.formData();

  const redirectURL = data.get("redirect-url");
  if (!redirectURL || typeof redirectURL !== "string") {
    return new Response(null, { status: 400 });
  }

  const preferences = new Preferences(cookies);
  preferences.set({
    showCategoryName: data.get("show-category-name") === "on",
  });

  return redirect(redirectURL);
};
