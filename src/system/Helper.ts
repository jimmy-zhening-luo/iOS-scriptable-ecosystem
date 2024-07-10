const hp_App = importModule(
  `app/App`,
) as typeof App;

abstract class Helper<
  Input = void,
  Output = void,
  Schema = never,
> extends hp_App<"Helper", Input, Output, Schema> {
  constructor(
    private readonly argument: Helper<Input>["input"],
    debug?: boolean,
  ) {
    super(
      "Helper",
      debug,
    );
  }

  protected get getInput() {
    return this.argument;
  }

  protected setOutput(runtime: ReturnType<Helper<Input, Output>["run"]>) {
    return runtime;
  }
}

module.exports = Helper;
