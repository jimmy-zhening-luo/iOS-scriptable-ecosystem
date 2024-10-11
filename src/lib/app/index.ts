import type { Setting } from "./filetypes/Setting";
import type { Storage } from "./filetypes/Storage";
import type { error } from "./error";

abstract class App<
  T extends string,
  Input,
  Output,
  Schema,
> {
  private readonly cache: Record<string, Storage> = {};
  protected abstract type: literalful<T>;

  private static get Setting() {
    return importModule<typeof Setting>("./filetypes/Setting");
  }

  private static get Storage() {
    return importModule<typeof Storage>("./filetypes/Storage");
  }

  private static get error() {
    return importModule<error>("./error");
  }

  protected get app() {
    const app = this.stringful(this.constructor.name, "Nameless app");

    Object.defineProperty(this, "app", { value: app, enumerable: true });

    return app;
  }

  protected get setting(): Schema extends Schema ? Schema : never {
    const setting = new App.Setting<Schema>(this.app).parse;

    Object.defineProperty(this, "setting", { value: setting, enumerable: true });

    return setting;
  }

  protected get input() {
    const input = this.getInput();

    Object.defineProperty(this, "input", { value: input, enumerable: true });

    return input;
  }

  protected get inputful() {
    const { input } = this;

    if (!this.truthy(input))
      throw new TypeError("Null input", { cause: input });

    Object.defineProperty(this, "inputful", { value: input, enumerable: true });

    return input;
  }

  protected get inputString() {
    const { input } = this,
    truthy = this.truthy(input) ? input : "";

    if (typeof truthy !== "string" && typeof truthy !== "number")
      throw new TypeError("Non-string input", { cause: input });

    const inputString = String(truthy);

    Object.defineProperty(this, "inputString", { value: inputString, enumerable: true });

    return inputString;
  }

  protected get inputStringful() {
    const inputStringful = this.stringful(this.inputString, "App: inputStringful");

    Object.defineProperty(this, "inputStringful", { value: inputStringful, enumerable: true });

    return inputStringful;
  }

  public run() {
    try {
      return this.output(this.runtime());
    }
    catch (e) {
      throw App.error(new Error(`${this.app}: run`, { cause: e }));
    }
  }

  protected subsetting<Subschema>(subpath: string): Subschema extends Subschema ? Subschema : never {
    if (subpath.length < 1)
      throw new ReferenceError("Empty subsetting path");

    return new App.Setting<Subschema>(`${this.app satisfies stringful}/${subpath as stringful}` as stringful).parse;
  }

  protected read(...file: Parameters<App<T, Input, Output, Schema>["storage"]>) {
    return this.storage(...file).read();
  }

  protected readful(...file: Parameters<App<T, Input, Output, Schema>["storage"]>) {
    return this.storage(...file).readful();
  }

  protected data<Data>(...file: Parameters<App<T, Input, Output, Schema>["storage"]>): Null<Data> {
    return this.storage(...file).data<Data>();
  }

  protected write(
    data: unknown,
    overwrite?:
      | "line"
      | "append"
      | boolean,
    ...file: Parameters<App<T, Input, Output, Schema>["storage"]>
  ) {
    this.storage(...file).write(data, overwrite);
  }

  protected load(id: string, roll = false) {
    const key = `${this.app}/${id}`;

    if (roll || !Keychain.contains(key)) {
      const local = this.key(id),
      value = local.readful();

      Keychain.set(key, value);
      local.delete();
    }

    return Keychain.get(key);
  }

  protected purge(id: string) {
    Keychain.remove(`${this.app}/${id}`);
  }

  protected stringful(string = "", cause = "") {
    if (string.length < 1)
      throw new TypeError("Unstringful", { cause });

    return string as stringful;
  }

  protected stringfuls<T extends readonly string[]>(array: T, cause = "") {
    if (array.length < 1 || !array.every((i): i is stringful => i.length > 0))
      throw new TypeError("Unstringful array", { cause });

    return array as unknown as (
      T extends readonly [string, ...string[]]
        ? { [K in keyof T]: stringful; }
        : Arrayful<stringful>
    );
  }

  protected time(date?: Date) {
    return this.datetime("yyyyMMddhhmmssZ", date);
  }

  protected date(date?: Date) {
    return this.datetime("EEEE, MMMM d, y", date);
  }

  protected url(string: string) {
    const normalize = (part = "", lower = false) => lower ? part.toLowerCase() : part,
    attempt = this.parseURL(string),
    retry = attempt === null
      ? this.parseURL(string, true)
      : null;

    if (attempt === null && retry === null)
      throw new SyntaxError("Unparseable to URL", { cause: string });

    const parts = (attempt ?? retry) as Field<
      | "scheme"
      | "host"
      | "path"
      | "query"
      | "fragment"
    >;

    return {
      scheme: normalize(parts.scheme, true),
      host: normalize(parts.host, true),
      path: normalize(parts.path),
      query: normalize(parts.query),
      fragment: normalize(parts.fragment),
    };
  }

  private storage(file: string | { ext: string; name?: string } = this.app) {
    const { name, ext } = typeof file === "object"
      ? {
          name: "name" in file ? file.name : this.app,
          ext: file.ext,
        }
      : {
          name: file,
          ext: "txt",
        },

    cacheId = `${name}:${ext}`,
    cache = this.cache[cacheId];

    if (typeof cache !== "undefined")
      return cache;
    else {
      const newStorage = new App.Storage(
        this.app,
        name,
        ext,
      );

      this.cache[cacheId] = newStorage;

      return newStorage;
    }
  }

  private key(id: string) {
    return this.storage({ name: id, ext: "" });
  }

  private truthy(value: Input): value is NonNullable<Input> {
    const falsy = (value: unknown): value is Null<undefined> => {
      const v = value ?? false,
      bv = Boolean(v);

      return !bv || (typeof v === "string" ? Number(v) === 0 : Array.isArray(v) ? v.join("").length < 1 : false);
    };

    return !falsy(value);
  }

  private datetime(format: string, date = new Date, locale = "en") {
    const d = new DateFormatter;

    d.dateFormat = format;
    d.locale = locale;

    return d.string(date);
  }

  private parseURL(string: string, tryHttp = false) {
    const is = (part: undefined | string): part is stringful => typeof part !== "undefined" && part.length > 1,
    [
      ,,scheme,,host,
      path,,query,,fragment,
    ] = (/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/u).exec(`${tryHttp ? "https" : ""}${string}`) ?? [];

    return is(scheme) && (!tryHttp || is(host) || is(path))
      ? {
          scheme,
          host,
          path,
          query,
          fragment,
        }
      : null;
  }

  protected abstract getInput(): Input;
  protected abstract runtime(): Output;
  protected abstract output(runtime: ReturnType<App<T, Input, Output, Schema>["runtime"]>): ReturnType<App<T, Input, Output, Schema>["runtime"]>;
}

module.exports = App;
export type { App };
