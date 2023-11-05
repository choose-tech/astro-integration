import type { AstroCookies } from "astro";
import options from "virtual:choose-tech/options";

type PreferencesData = {
  showCategoryName: boolean;
};

export class Preferences {
  private key = `${options.name}:preferences`;

  constructor(private cookies: AstroCookies) {}

  get(): PreferencesData {
    const raw = this.cookies.get(this.key);

    if (!raw) {
      return {
        showCategoryName: true,
      };
    }

    const data = raw.json();

    return {
      showCategoryName: data.showCategoryName === true,
    };
  }

  set(data: PreferencesData) {
    this.cookies.set(this.key, JSON.stringify(data), {
      path: "/",
      sameSite: true,
      secure: true,
      httpOnly: true,
    });
  }
}
