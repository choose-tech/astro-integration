import type { APIRoute } from "astro";
import { Preferences } from "../../utils/preferences";

export const POST: APIRoute = async ({ redirect, request, cookies }) => {
  const referer = request.headers.get("referer");
  if (!referer) {
    return new Response(null, { status: 400 });
  }

  const data = await request.formData();
  const preferences = new Preferences(cookies)

  preferences.set({
    showCategoryName: data.get("show-category-name") === "on",
  });

  return redirect(referer);
};
