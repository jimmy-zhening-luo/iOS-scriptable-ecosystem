const _RepeatCharString: typeof RepeatCharString = importModule("repeatcharstring/RepeatCharString");

class BoundedRepeatCharString extends _RepeatCharString {

  readonly min: number;
  readonly max: number;

  constructor(
    min: number,
    max: number,
    charstring: string,
    ...ofCharInputs: Char.CharInput[]
  ) {
    let minInt: number = new BoundedRepeatCharString._PositiveInt(min).toNumber();
    let maxInt: number = new BoundedRepeatCharString._PositiveInt(max).toNumber();
    if (Number.isNaN(minInt)
      || Number.isNaN(maxInt)
    ) minInt = maxInt = 0;
    else {
      if (minInt > maxInt) {
        const prevMinInt: number = minInt;
        minInt = maxInt;
        maxInt = prevMinInt;
      }
      if (minInt === Infinity)
        minInt = maxInt = 0;
    }
    super(
      charstring.length >= minInt && charstring.length <= maxInt ?
        charstring
        : "",
      ...ofCharInputs
    );
    this.min = minInt;
    this.max = maxInt;
  }
}

namespace BoundedRepeatCharString {
  export const _PositiveInt: typeof PositiveInteger = importModule("./system/application/common/primitives/numbers/PositiveInteger");
}

module.exports = BoundedRepeatCharString;
