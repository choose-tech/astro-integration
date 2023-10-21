type TermType = "implies" | "categories" | "terms";

export class SearchQuery {
  private _terms: Array<string>;

  constructor(query: string) {
    this._terms = decodeURIComponent(query)
      .split(" ")
      .filter((t) => t !== "");
  }

  get isEmpty() {
    return this._terms.length === 0;
  }

  get implies() {
    return this._terms
      .filter((t) => t.startsWith("implies:"))
      .map((t) => t.split("implies:")[1]);
  }

  get categories() {
    return this._terms
      .filter((t) => t.startsWith("category:"))
      .map((t) => t.split("category:")[1]);
  }

  get terms() {
    return this._terms.filter(
      (t) => !t.startsWith("implies:") && !t.startsWith("category:")
    );
  }

  query() {
    // TODO: sort alphabetically?
    return [
      ...this.categories.map((c) => `category:${c}`),
      ...this.implies.map((c) => `implies:${c}`),
      ...this.terms,
    ].join(" ");
  }

  encodedQuery({ format = "string" }: { format?: "string" | "url" } = {}) {
    switch (format) {
      case "string":
        return encodeURIComponent(this.query());
      case "url":
        return `?q=${encodeURIComponent(this.query())}`;
    }
  }

  add(type: TermType, value: string) {
    this._terms.push(this.prefix(type, value));
  }

  remove(type: TermType, value: string) {
    const term = this.prefix(type, value);
    const index = this._terms.indexOf(term);
    if (index > -1) {
      this._terms.splice(index, 1);
    }
  }

  toggle(type: TermType, value: string) {
    if (this[type].includes(value)) {
      this.remove(type, value)
    } else {
      this.add(type, value)
    }
  }

  private prefix(type: TermType, value: string) {
    const prefix = {
      implies: "implies:",
      categories: "category:",
      terms: "",
    }[type];

    return prefix + value;
  }

  static fromSearchParams(searchParams: URLSearchParams) {
    return new SearchQuery(searchParams.get("q") ?? "");
  }
}
