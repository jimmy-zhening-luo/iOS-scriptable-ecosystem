import type { Filetype } from "./filetype/index";

const cFiletype = importModule<typeof Filetype>("./filetype/index");

class Setting<T extends string, Schema> extends cFiletype<"Setting", T> {
  constructor(
    type: literalful<T>,
    app: stringful,
  ) {
    super(
      false,
      "Setting",
      type,
      null,
      app,
      "json",
    );
  }

  public get parse(): Schema {
    try {
      const setting: unknown = JSON.parse(this.readful());

      if (typeof setting !== "object" || setting === null)
        throw new TypeError("Setting file has wrong schema", { cause: this.read() });
      else {
        Object.defineProperty(this, "parse", { value: setting, writable: false });

        return setting as Schema;
      }
    }
    catch (e) {
      throw new SyntaxError(`Setting: parse (${this.name})`, { cause: e });
    }
  }

  protected write(): never {
    throw new ReferenceError("Setting: write forbidden");
  }

  protected delete(): never {
    throw new ReferenceError("Setting: delete forbidden");
  }
}

module.exports = Setting;
export type { Setting };
