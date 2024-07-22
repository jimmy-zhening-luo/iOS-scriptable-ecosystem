const dFiletype = importModule<typeof Filetype>(
  `filetype/Filetype`,
);

class Storage<Class extends string> extends dFiletype<"Storage", Class, File> {
  constructor(
    category: literalful<Class>,
    app: stringful,
    ext = `txt`,
    filename?: string,
  ) {
    super(
      "Storage",
      category,
      Storage.File,
      ext,
      app,
      filename ?? app,
    );
  }

  public write(
    data: unknown,
    overwrite:
      | "line"
      | "append"
      | boolean = true,
  ) {
    try {
      const buffer = data ?? null;

      if (buffer === null)
        throw new TypeError(`Tried to undefined | null to storage`);
      else if (typeof buffer === "object")
        if (
          Array.isArray(buffer)
          && buffer.every(element => typeof element === "string")
        )
          this.file.write(
            buffer
              .reverse()
              .join("\n"),
            overwrite === false ? false : "line",
          );
        else
          this.file.write(
            JSON.stringify(buffer),
            overwrite !== false,
          );

      else
        this.file.write(
          String(buffer),
          overwrite,
        );
    }
    catch (e) {
      throw new Error(
        `Storage: write`,
        { cause: e },
      );
    }
  }
}

module.exports = Storage;
