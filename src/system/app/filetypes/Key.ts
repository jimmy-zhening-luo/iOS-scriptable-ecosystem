import type { Filetype } from "./filetype/index";

const kFiletype = importModule<typeof Filetype>("./filetype/index");

class Key<AT extends string> extends kFiletype<"Key", AT> {
  constructor(
    apptype: literalful<AT>,
    app: stringful,
    handle: stringful,
  ) {
    super(
      "Key",
      apptype,
      false,
      handle,
      null,
      app,
    );
  }

  private get fullname() {
    return this.subpath;
  }

  public load(fallback = false) {
    try {
      const { fullname } = this;

      if (!Keychain.contains(fullname))
        if (!fallback)
          throw new ReferenceError("No such key in Keychain, fallback:false");
        else
          return super.readful();
      else {
        const key = Keychain.get(fullname);

        if (key.length < 1)
          throw new EvalError("Fatal: key found in Keychain, but empty");
        else
          return key as stringful;
      }
    }
    catch (e) {
      throw new Error(`Key: load (${this.name})`, { cause: e });
    }
  }

  public add(roll = false) {
    try {
      const { fullname } = this;

      if (Keychain.contains(fullname) && !roll)
        throw new ReferenceError("Key already in Keychain, roll:false");
      else {
        const local = super.readful();

        Keychain.set(fullname, local);

        const keychain = Keychain.get(fullname);

        if (local !== keychain)
          throw new EvalError("Fatal: Created key in Keychain with wrong value", { cause: { local, keychain } });
      }
    }
    catch (e) {
      throw new Error(`Key: add (${this.name})`, { cause: e });
    }
  }

  public roll() {
    this.add(true);
  }

  public remove() {
    const { fullname } = this;

    if (Keychain.contains(fullname)) {
      Keychain.remove(fullname);

      if (Keychain.contains(fullname))
        throw new EvalError("Fatal: Removed key is still in Keychain");
    }
  }

  public override read(): never {
    throw new ReferenceError("Key: read forbidden");
  }

  public override readful(): never {
    throw new ReferenceError("Key: readful forbidden");
  }

  protected write(): never {
    throw new ReferenceError("Key: write forbidden");
  }
}

module.exports = Key;
export type { Key };
