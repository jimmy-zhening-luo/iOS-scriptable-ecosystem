import Filetype from "./filetype";

class Storage extends Filetype<"Storage", true> {
  constructor(
    app: stringful,
    name: string,
    ext: string,
  ) {
    super(
      "Storage",
      true,
      app,
      name,
      ext,
    );
  }

  public override write<T>(
    content: T,
    overwrite:
      | "line"
      | "append"
      | boolean = true,
  ) {
    if (content === null || typeof content === "undefined")
      throw new TypeError("Write data is null", { cause: content });

    const write = Array.isArray(content)
      ? {
          string: content.reverse().join("\n"),
          overwrite: overwrite === false ? false : "line" as const,
        }
      : typeof content === "object"
        ? {
            string: JSON.stringify(content),
            overwrite: overwrite !== false,
          }
        : {
            string: String(content),
            overwrite,
          };

    return this.file.write(write.string, write.overwrite) as unknown as T;
  }

  public override delete(): void {
    this.file.delete();
  }
}

export default Storage;
