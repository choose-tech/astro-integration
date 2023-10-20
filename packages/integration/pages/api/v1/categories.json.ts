import { getCategories } from "../../../utils/get-categories";

export const GET = async () => {
  const categories = await getCategories();

  return new Response(JSON.stringify(categories), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
