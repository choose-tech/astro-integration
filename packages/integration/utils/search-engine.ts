import type { Library } from "./get-libraries";
import type { SearchQuery } from "./search-query";
import Fuse from "fuse.js";

export class SearchEngine {
  constructor(private query: SearchQuery) {}

  async search(libraries: Array<Library>): Promise<Array<Library>> {
    const { categories, implies, terms } = this.query;

    const filteredLibraries = libraries.filter((lib) => {
      // TODO: extract logic
      if (implies.length > 0) {
        if (implies.includes(lib.id)) {
          return true;
        }

        if (lib.implies.length === 0) {
          return false;
        }

        let hasMatch = false;

        for (const implied of lib.implies) {
          if (!hasMatch && implies.includes(implied)) {
            hasMatch = true;
          }
        }

        if (!hasMatch) return false;
      }

      for (const categoryId of categories) {
        let found = false;
        for (const category of lib.categories) {
          if (category.id === categoryId) {
            found = true;
            break;
          }
        }
        if (!found) {
          return false;
        }
      }

      return true;
    });

    if (terms.length === 0) {
      return filteredLibraries;
    }

    const fuse = new Fuse(filteredLibraries, {
      keys: ["name"],
      threshold: 0.2,
      ignoreLocation: true,
      isCaseSensitive: false,
    });

    return fuse.search(terms.join(" ")).map((e) => e.item);
  }
}
