import { useEffect, useRef, useState } from "react";
import { useDebounce, useSearchParam } from "react-use";

export default function Search({
  defaultValue,
}: {
  defaultValue: string | null;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const aRef = useRef<HTMLAnchorElement>(null);

  const navigate = (href: string) => {
    const a = aRef.current;
    if (!a) return;
    a.href = href;
    // const a = document.createElement("a");
    // Object.assign(a, { href, style: "display:none;" });
    // document.body.appendChild(a);
    a.click();
    a.href = "#";
    // a.remove();
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const search = new URLSearchParams(
      new FormData(e.currentTarget as HTMLFormElement) as any
    ).toString();

    navigate(`/?${search}`);
  };

  useDebounce(
    () => {
      // TODO: make sure it does not run twice
      navigate(`/?q=${value ?? ""}`);
    },
    300,
    [value]
  );

  const q = useSearchParam("q");

  useEffect(() => {
    if (q !== value) {
      setValue(q ?? "");
    }
  }, [q]);

  return (
    <form
      action="/"
      method="get"
      className="relative flex h-full flex-1 items-center"
      onSubmit={submit}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="absolute left-6 h-6 w-6 text-gray-200"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="m21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        ></path>
      </svg>
      <input
        id="search-input"
        type="search"
        name="q"
        value={value}
        onChange={({ currentTarget }) => {
          setValue(currentTarget.value);
        }}
        className="form-input mr-6 h-full w-full border-4 border-transparent bg-transparent pl-14 font-mono !outline-none !ring-0 placeholder:select-none focus:border-blue-600 focus-visible:!outline-none"
        placeholder="Start typing"
      />
      <a ref={aRef} href="#" aria-hidden="true" className="hidden"></a>
    </form>
  );
}
