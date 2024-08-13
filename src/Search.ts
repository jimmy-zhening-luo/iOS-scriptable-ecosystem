// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: search;
"use strict";

import type { Shortcut } from "./system/Shortcut";
import type { Query } from "./apps/method/search/query/index";
import type BrowserEngine from "./apps/method/search/engines/browser";
import type FindEngine from "./apps/method/search/engines/find";
import type ShortcutEngine from "./apps/method/search/engines/shortcut";

type SearchEngines = {
  browser: typeof BrowserEngine;
  find: typeof FindEngine;
  shortcut: typeof ShortcutEngine;
};

namespace Search {
  const shortcut = importModule<typeof Shortcut>("./system/Shortcut");

  export class Search extends shortcut<
    string,
    SearchOutput,
    SearchSetting
  > {
    private static get Query() {
      return importModule<typeof Query>("./apps/method/search/query/index");
    }

    protected runtime() {
      const { inputString, setting } = this,
      input = inputString.length > 0 ? inputString : this.read(),
      { app: { tag, key, fallback }, user: { engines, alias } } = setting,
      TAG = this.stringful(tag),
      params = this.stringfuls([
        key.chat,
        key.translate,
        key.mathShort,
        key.mathLong,
        fallback.one,
        fallback.two,
        fallback.three,
        fallback.rest,
      ] as const),
      query = new Search.Query(input, engines, alias, ...params),
      entry = engines[query.key] ?? null;

      if (entry === null)
        throw new ReferenceError(`Search key has no matching record`, { cause: query.key });
      else {
        const engine = Array.isArray(entry) || typeof entry === "string"
          ? new (this.SearchEngine("browser"))(entry, TAG)
          : "url" in entry
            ? new (this.SearchEngine("browser"))(
              entry.url,
              TAG,
              entry.browser,
              entry.separator,
              entry.encodeComponent,
              entry.inprivate,
              entry.output,
            )
            : "shortcut" in entry
              ? new (this.SearchEngine("shortcut"))(entry.shortcut, entry.output)
              : new (this.SearchEngine("find"))(entry.find);

        this.write(String(query));

        return engine.resolve(query);
      }
    }

    private SearchEngine<T extends "browser" | "find" | "shortcut">(provider: T) {
      return importModule<SearchEngines[T]>(`./apps/method/search/engines/${provider}`);
    }
  }
}

(new Search.Search).run();
