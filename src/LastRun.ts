// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-gray; icon-glyph: less-than-equal;
"use strict";

namespace LastRun {
  const shortcut = importModule("system/Shortcut") as typeof Shortcut;

  export class LastRun extends shortcut<
    & Field<"id">
    & Scalar<"m">
    ,
    boolean
  > {
    public runtime() {
      const now = Date
        .now();
      const {
        id,
        m,
      } = this
        .inputful;
      const table = this
        .data<FieldTable>()
        ?? {};
      const savedRun = table[
        id
      ] ?? null;

      table[
        id
      ] = String(
        now,
      );      this
        .write(
          table,
        );

      return savedRun === null
        || now - Number(
          savedRun,
        ) > 60000 * m;
    }
  }
}

new LastRun.LastRun()
  .run();
