const s_Primitiveful: typeof Primitiveful = importModule(
  "./common/types/safe/acceptors/Primitiveful",
) as typeof Primitiveful;

function Stringful<S extends string>(
  string: S,
  context?: string,
): S & stringful {
  return s_Primitiveful(
    (string: S): string is S & stringful =>
      string.length > 0,
    string,
    `stringful: string is empty`,
    context,
  );
}

module.exports = Stringful;
