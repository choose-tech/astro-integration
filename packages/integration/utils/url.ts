export const getSearchParamsAsObject = (url: URL) => {
  const params = [...url.searchParams.entries()];

  const result: Record<string, Array<string>> = {};

  for (const [key, value] of params) {
    if (key in result) {
      result[key].push(value);
      result[key] = result[key].sort((a, b) => a.localeCompare(b));
    } else {
      result[key] = [value];
    }
  }

  return result;
};

export const cleanQuery = (query: string) => {
  return query
    .split(" ")
    .filter((v) => v !== "")
    .join(" ")
    .trim();
};
