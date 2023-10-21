import { getLibraries } from "../../../utils/get-libraries";

export const GET = async () => {
  const libraries = await getLibraries();

  return new Response(JSON.stringify(libraries), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
