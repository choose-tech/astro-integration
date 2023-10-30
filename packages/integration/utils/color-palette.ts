import { getColors } from "theme-colors";

export const getColorPalette = (color: string) => {
  const theme = getColors(color);

  return Object.fromEntries(
    Object.entries(theme).map(([k, v]) => [k, hexToRgb(v)])
  );
};

const hexToRgb = (hex: string) => {
  const removeHash = (hex: string) => {
    let arr = hex.split("");
    arr.shift();
    return arr.join("");
  };

  const expand = (hex: string) => {
    return hex
      .split("")
      .reduce(function (accum, value) {
        return accum.concat([value, value]);
      }, [] as Array<string>)
      .join("");
  };

  if (hex.charAt && hex.charAt(0) === "#") {
    hex = removeHash(hex);
  }

  if (hex.length === 3) {
    hex = expand(hex);
  }

  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return [r, g, b] as const;
};
