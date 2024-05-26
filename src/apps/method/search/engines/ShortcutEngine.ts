const s_IEngine: typeof IEngine = importModule(
  "engine/IEngine",
) as typeof IEngine;

class ShortcutEngine extends s_IEngine {
  protected readonly shortcut: string;
  protected readonly output: boolean;

  constructor(
    shortcut: string,
    output = false,
  ) {
    try {
      super(
        "shortcut",
      );

      if (
        shortcut
          .length > 0
      ) {
        this
          .shortcut = shortcut;
        this
          .output = output;
      }
      else
        throw new SyntaxError(
          `Shortcut engine name empty`,
        );
    }
    catch (e) {
      throw new EvalError(
        `ShortcutEngine: ctor`,
        { cause: e },
      );
    }
  }

  protected options() {
    try {
      const {
        shortcut,
        output,
      } = this;

      return {
        shortcut,
        output,
      };
    }
    catch (e) {
      throw new EvalError(
        `ShortcutEngine: options`,
        { cause: e },
      );
    }
  }
}

module.exports = ShortcutEngine;
