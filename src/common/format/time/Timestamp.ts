const sMoment = importModule(
  `moment/Moment`,
) as typeof Moment;

class Timestamp extends sMoment {
  protected separator = "";
  protected formatDate = {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  };
  protected formatLocal = {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  protected afterDate(date: string) {
    try {
      return date
        .split("/")
        .join("");
    }
    catch (e) {
      throw new EvalError(
        `Timestamp: afterDate`,
        { cause: e },
      );
    }
  }

  protected afterLocal(local: string) {
    try {
      return local
        .split(":")
        .join("");
    }
    catch (e) {
      throw new EvalError(
        `Timestamp: afterLocal`,
        { cause: e },
      );
    }
  }
}

module.exports = Timestamp;
