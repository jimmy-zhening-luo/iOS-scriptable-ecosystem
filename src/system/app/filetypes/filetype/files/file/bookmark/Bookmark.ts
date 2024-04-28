class Bookmark {
  public readonly name: string = "Bookmark";
  public readonly alias: stringful;
  public readonly path: ReturnType<Rootpath["toString"]>;

  constructor(bookmark: string | Bookmark) {
    try {
      if (bookmark instanceof Bookmark) {
        this.alias = bookmark.alias;
        this.path = bookmark.path;
      }
      else {
        this.alias = Bookmark.stringful(
          bookmark.trim(),
          "alias.trim()",
        );

        if (
          !FileManager
            .iCloud()
            .bookmarkExists(this.alias)
        )
          throw new ReferenceError(
            `no Scriptable bookmark with alias: '${this.alias}'`,
          );
        else
          this.path = Bookmark.stringful(
            FileManager
              .iCloud()
              .bookmarkedPath(this.alias),
            "bookmark exists, but resolves to empty path",
          );
      }
    }
    catch (e) {
      throw new EvalError(
        `Bookmark: ctor`,
        { cause: e },
      );
    }
  }

  private static get stringful(): typeof Stringful {
    try {
      return importModule("./common/types/literal/Stringful") as typeof Stringful;
    }
    catch (e) {
      throw new ReferenceError(
        `Bookmark: import Stringful`,
        { cause: e },
      );
    }
  }

  public static [Symbol.hasInstance](instance: unknown): boolean {
    try {
      return (
        instance !== null
        && typeof instance === "object"
        && "name" in instance
        && instance.name === "Bookmark"
      );
    }
    catch (e) {
      throw new EvalError(
        `Bookmark: [Symbol.hasInstance]`,
        { cause: e },
      );
    }
  }

  public toString(): string {
    try {
      return this.path;
    }
    catch (e) {
      throw new EvalError(
        `Bookmark: toString`,
        { cause: e },
      );
    }
  }
}

module.exports = Bookmark;
