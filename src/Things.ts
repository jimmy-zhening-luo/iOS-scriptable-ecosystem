// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: pen-square;
"use strict";

namespace Things {
  const shortcut = importModule<typeof Shortcut>(`system/Shortcut`);

  export class Things extends shortcut<
    string,
    readonly ThingsItem[],
    ThingsSetting
  > {
    protected runtime() {
      const {
        tag,
        delim,
        lists,
      } = this.setting;

      if (
        tag.length < 1
        || delim.line.length < 1
        || delim.item.length < 1
      )
        throw new TypeError(`setting: empty tag or delim`);
      else if (delim.line === delim.item)
        throw new SyntaxError(`setting: identical delim for 'item' and 'line'`);
      else if (delim.line === tag)
        throw new SyntaxError(`setting: tag is identical to delim 'line'`);
      else {
        const input = this.inputStringful,
          items = input
            .split(delim.item)
            .reverse()
            .map(
              item => item
                .trim()
                .split(delim.line)
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .join(delim.line),
            );

        return items.map(
          (item): ThingsItem => {
            const tagIndex = item.lastIndexOf(tag),
              tagent = tagIndex < 0
                ? null
                : item.slice(
                  tagIndex + 1,
                  tagIndex + 2,
                ),
              [when, list] = tagent === null
                ? [null, null]
                : tagent.length < 1 || tagent === delim.line || !(tagent in lists) || (lists[tagent] ?? "").length < 1
                  ? ["today", null]
                  : [
                      null,
                      lists[tagent] as unknown as string,
                    ],
              lines = item.split(delim.line);

            return {
              title: lines.shift() ?? "",
              notes: lines.join(delim.line),
              ...when === null ? {} : { when },
              ...list === null ? {} : { list },
            };
          },
        );
      }
    }
  }
}

(new Things.Things).run();
