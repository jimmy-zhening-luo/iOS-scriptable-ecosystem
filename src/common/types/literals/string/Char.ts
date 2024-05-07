const c_typeful: typeof typeful = importModule(
  "./common/types/literals/typeful/Typeful",
) as typeof typeful;

function Char(
  literal: string,
  errorContext?: string,
): char {
  return c_typeful<
    char,
    string
  >(
    (C: string): C is char =>
      C.length === 1,
    literal,
    `char: length !== 1`,
    errorContext,
  );
}

module.exports = Char;
