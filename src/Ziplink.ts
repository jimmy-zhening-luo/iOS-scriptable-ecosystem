// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-gray; icon-glyph: sign-in-alt;
"use strict";

import type { Shortcut } from "./system/Shortcut";

namespace Ziplink {
  const shortcut = importModule<typeof Shortcut>("./system/Shortcut");

  export class Ziplink extends shortcut<string, string> {
    protected runtime() {
      const url = this.inputStringful,
      cache = this.data<FieldTable>(null, "json") ?? {},
      cached = Object.entries(cache).find(([, u]) => u === url)?.[0] ?? null,
      id = cached ?? this.guid64();

      if (id !== cached) {
        cache[id] = url;
        this.write(
          cache,
          null,
          "json",
        );
      }

      return `shortcuts://run-shortcut?name=i&input=${id}`;
    }
  }
}

(new Ziplink.Ziplink).run();
