// From https://github.com/unjs/theme-colors, with shade 950

function parseColor(color = "") {
  if (typeof color !== "string") {
    throw new TypeError("Color should be string!");
  }

  const hexMatch = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  if (hexMatch) {
    return hexMatch.splice(1).map((c) => parseInt(c, 16));
  }

  const hexMatchShort = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(color);
  if (hexMatchShort) {
    return hexMatchShort.splice(1).map((c) => parseInt(c + c, 16));
  }

  if (color.includes(",")) {
    return color.split(",").map((p) => parseInt(p));
  }

  throw new Error("Invalid color format! Use #ABC or #AABBCC or r,g,b");
}

function hexValue(components: Array<number>) {
  return (
    "#" +
    components.map((c) => `0${c.toString(16).toUpperCase()}`.slice(-2)).join("")
  );
}

function tint(components: Array<number>, intensity: number) {
  return components.map((c) => Math.round(c + (255 - c) * intensity));
}

function shade(components: Array<number>, intensity: number) {
  return components.map((c) => Math.round(c * intensity));
}

const withTint = (intensity: number) => (hex: Array<number>) =>
  tint(hex, intensity);

const withShade = (intensity: number) => (hex: Array<number>) =>
  shade(hex, intensity);

const variants = {
  50: withTint(0.95),
  100: withTint(0.9),
  200: withTint(0.75),
  300: withTint(0.6),
  400: withTint(0.3),
  500: (c: Array<number>) => c,
  600: withShade(0.9),
  700: withShade(0.6),
  800: withShade(0.45),
  900: withShade(0.3),
  950: withShade(0.2),
};

export function getColors(color: string) {
  const colors: Record<string, string> = {};
  const components = parseColor(color);
  for (const [name, fn] of Object.entries(variants)) {
    colors[name] = hexValue(fn(components));
  }
  return colors;
}

function hexToRgb(hex: string) {
  function removeHash(hex: string) {
    var arr = hex.split("");
    arr.shift();
    return arr.join("");
  }

  function expand(hex: string) {
    return hex
      .split("")
      .reduce(function (accum, value) {
        return accum.concat([value, value]);
      }, [] as Array<string>)
      .join("");
  }

  if (hex.charAt && hex.charAt(0) === "#") {
    hex = removeHash(hex);
  }

  if (hex.length === 3) {
    hex = expand(hex);
  }

  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;

  return [r, g, b] as const;
}

function rgbToHsl(r: number, g: number, b: number) {
  var d, h, l, max, min, s;
  r /= 255;
  g /= 255;
  b /= 255;
  max = Math.max(r, g, b);
  min = Math.min(r, g, b);
  h = 0;
  s = 0;
  l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  h = h * 360;
  s = s * 100 + "%";
  l = l * 100 + "%";
  return [h, s, l] as const;
}

export function hexToHsl(hex: string) {
  var hsl = rgbToHsl(...hexToRgb(hex));
  return [Math.round(hsl[0]), parseInt(hsl[1], 10), parseInt(hsl[2], 10)] as const;
}
