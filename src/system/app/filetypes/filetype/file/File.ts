class File {
  private readonly manager = FileManager.local();
  private readonly _root: Stringify<Filepath<1>>;
  private readonly _subpath: Filepath<0>;

  constructor(
    root:
      | File
      | Bookmark
      | { graft: File },
    ...subpaths: ConstructorParameters<typeof Filepath<0>>[1][]
  ) {
    try {
      this._root = "root" in root || "alias" in root
        ? root.path
        : root.graft._root;
      this._subpath = new File.Subpath(
        0,
        ...subpaths,
      );
    }
    catch (e) {
      throw new EvalError(
        `File: ctor`,
        { cause: e },
      );
    }
  }

  private static get Subpath() {
    try {
      return importModule<typeof Filepath<0>>(
        "./common/validator/impl/filepath/Filepath",
      );
    }
    catch (e) {
      throw new ReferenceError(
        `File: import Filepath<0> as Subpath`,
        { cause: e },
      );
    }
  }

  public get path(): Stringify<Filepath<1>> {
    try {
      return this._subpath.prepend(this._root);
    }
    catch (e) {
      throw new EvalError(
        `File: path`,
        { cause: e },
      );
    }
  }

  public get subpath(): Stringify<Filepath<0>> {
    try {
      return this._subpath.toString();
    }
    catch (e) {
      throw new EvalError(
        `File: subpath`,
        { cause: e },
      );
    }
  }

  public get isDirectory() {
    try {
      return this.manager.isDirectory(this.path);
    }
    catch (e) {
      throw new EvalError(
        `File: isDirectory`,
        { cause: e },
      );
    }
  }

  public get isFile() {
    try {
      return this.manager.fileExists(this.path);
    }
    catch (e) {
      throw new EvalError(
        `File: isFile`,
        { cause: e },
      );
    }
  }

  public get root(): this {
    try {
      return new (
        this.constructor as new (...path: ConstructorParameters<typeof File>)=> this
      )({ graft: this });
    }
    catch (e) {
      throw new EvalError(
        `File: root`,
        { cause: e },
      );
    }
  }

  public get parent() {
    try {
      return new (
        this.constructor as new (...path: ConstructorParameters<typeof File>)=> this
      )(
        this.root,
        this._subpath.parent,
      );
    }
    catch (e) {
      throw new EvalError(
        `File: parent`,
        { cause: e },
      );
    }
  }

  public read(stringful = false) {
    try {
      if (!this.isFile)
        if (stringful)
          throw new ReferenceError(`file does not exist`);
        else
          return "";
      else
        return this.manager.readString(this.path);
    }
    catch (e) {
      throw new EvalError(
        `File: read (${String(this)})`,
        { cause: e },
      );
    }
  }

  public readful(error = ""): stringful {
    try {
      const read = this.read(true);

      if (read.length > 0)
        return read as stringful;
      else
        throw new TypeError(
          `empty file`,
          { cause: { error } },
        );
    }
    catch (e) {
      throw new EvalError(
        `File: readful (${String(this)})`,
        { cause: e },
      );
    }
  }

  public write(
    string: string,
    overwrite:
      | "line"
      | "append"
      | boolean = false,
  ) {
    try {
      if (this.isDirectory)
        throw new ReferenceError(`path is folder`);
      else
        if (this.isFile)
          if (overwrite === false)
            throw new TypeError(`file exists & overwrite false`);
          else
            this.manager.writeString(
              this.path,
              overwrite === "append"
                ? [this.read(), string]
                    .join("")
                : overwrite === "line"
                  ? [string, this.read()]
                      .join("\n")
                  : string,
            );
        else {
          if (!this.parent.isDirectory)
            this.manager.createDirectory(
              this.parent.path,
              true,
            );

          this.manager.writeString(
            this.path,
            string,
          );
        }
    }
    catch (e) {
      throw new EvalError(
        `File: write (${String(this)})`,
        { cause: e },
      );
    }
  }

  public toString() {
    return this.path;
  }
}

module.exports = File;
