const _APPLICATION_CONFIG_BOOKMARK: string = "@_APPLICATION_CONFIG";

abstract class Utility {
  private static readonly _APPLICATION_CONFIG_BOOKMARK: string =
    _APPLICATION_CONFIG_BOOKMARK;

  protected readonly _file: File;

  constructor(
    utilityName: string,
    FileTypeConstructor: typeof File,
    utilityFileSubpath: string,
  ) {
    try {
      this._file = new FileTypeConstructor(
        Utility._utilityRootBookmark(utilityName),
        utilityFileSubpath,
      );
    } catch (e) {
      throw new Error(
        `Utility: constructor: Caught unhandled exception while creating Utility file: \n${e}`,
      );
    }
  }

  private static _utilityRootBookmark(utilityName: string): Bookmark {
    try {
      const utilityRootBookmarkName: string =
        new Map<string, string>(Object.entries(Utility._applicationConfig)).get(
          utilityName,
        ) ?? "";
      if (utilityRootBookmarkName === "")
        throw new ReferenceError(
          `Utility class named '${utilityName}' is not configured in the application config. Each utility class should have a corresponding entry in the application config with [key: utility class name]: value: file root bookmark name. See value of application config: ${JSON.stringify(
            Utility._applicationConfig,
          )}`,
        );
      else {
        return new Utility.Bookmark(utilityRootBookmarkName);
      }
    } catch (e) {
      if (!(e instanceof ReferenceError))
        e = new Error(
          `Caught unhandled exception while getting utility root bookmark name for the Utility class named '${utilityName}'. See unhandled exception: \n${e}`,
        );
      throw new Error(
        `Error while getting Utility root bookmark for the Utility class named '${utilityName}': \n${e}`,
      );
    }
  }

  private static get _applicationConfig(): ApplicationConfigProto {
    try {
      return JSON.parse(
        new Utility.ReadOnlyFile(
          new Utility.Bookmark(Utility._APPLICATION_CONFIG_BOOKMARK),
        ).data,
      );
    } catch (e) {
      throw new Error(
        `Utility: applicationConfig: Caught unhandled exception while parsing application config into JSON object: \n${e}`,
      );
    }
  }

  get exists(): boolean {
    try {
      return this._file.exists;
    } catch (e) {
      throw new Error(`Utility: exists: Error checking if file exists: \n${e}`);
    }
  }

  get path(): typeof Utility.prototype._file.path {
    try {
      return this._file.path;
    } catch (e) {
      throw new Error(`Utility: path: Error getting path: \n${e}`);
    }
  }

  get subpath(): typeof Utility.prototype._file.subpath {
    try {
      return this._file.subpath;
    } catch (e) {
      throw new Error(`Utility: subpath: Error getting subpath: \n${e}`);
    }
  }

  get filename(): typeof Utility.prototype._file.leaf {
    try {
      return this._file.leaf;
    } catch (e) {
      throw new Error(`Utility: filename: Error getting filename: \n${e}`);
    }
  }

  get data(): typeof Utility.prototype._file.data {
    try {
      return this._file.data;
    } catch (e) {
      throw new Error(`Utility: data: Error getting data: \n${e}`);
    }
  }

  read(): ReturnType<typeof Utility.prototype._file.read> {
    try {
      return this._file.isReadable ? this._file.read() : "";
    } catch (e) {
      throw new Error(`Utility: read: Error reading file: \n${e}`);
    }
  }

  toString(): typeof Utility.prototype.data {
    try {
      return this.data;
    } catch (e) {
      throw new Error(`Utility: toString: Error getting data: \n${e}`);
    }
  }

  static get Files(): typeof Files {
    try {
      return importModule("./system/application/files/Files");
    } catch (e) {
      throw new ReferenceError(
        `Utility: Files: Error importing Files module: \n${e}`,
      );
    }
  }

  static get Browser(): typeof Browser {
    try {
      return importModule("./system/application/browser/Browser");
    } catch (e) {
      throw new ReferenceError(
        `Utility: Browser: Error importing Browser module: \n${e}`,
      );
    }
  }

  static get ReadOnlyFile(): typeof ReadOnlyFile {
    try {
      return Utility.Files.ReadOnlyFile;
    } catch (e) {
      throw new ReferenceError(
        `Utility: ReadOnlyFile: Error importing ReadOnlyFile class: \n${e}`,
      );
    }
  }

  static get File(): typeof File {
    try {
      return Utility.Files.File;
    } catch (e) {
      throw new ReferenceError(
        `Utility: File: Error importing File class: \n${e}`,
      );
    }
  }

  static get Bookmark(): typeof Bookmark {
    try {
      return Utility.Files.Bookmark;
    } catch (e) {
      throw new ReferenceError(
        `Utility: Bookmark: Error importing Bookmark class: \n${e}`,
      );
    }
  }

  static get FilepathString(): typeof FilepathString {
    try {
      return Utility.Files.FilepathString;
    } catch (e) {
      throw new ReferenceError(
        `Utility: Filepaths: Error importing Filepaths class: \n${e}`,
      );
    }
  }

  static get Url(): typeof Url {
    try {
      return Utility.Browser.Url;
    } catch (e) {
      throw new ReferenceError(
        `Utility: Url: Error importing Url class: \n${e}`,
      );
    }
  }

  static get Api(): typeof Api {
    try {
      return Utility.Browser.Api;
    } catch (e) {
      throw new ReferenceError(
        `Utility: Api: Error importing Api class: \n${e}`,
      );
    }
  }

  static get Callback(): typeof Callback {
    try {
      return Utility.Browser.Callback;
    } catch (e) {
      throw new ReferenceError(
        `Utility: Callback: Error importing Callback class: \n${e}`,
      );
    }
  }

  static get Endpoint(): typeof Endpoint {
    try {
      return Utility.Browser.Endpoint;
    } catch (e) {
      throw new ReferenceError(
        `Utility: Endpoint: Error importing Endpoint class: \n${e}`,
      );
    }
  }
}

module.exports = Utility;
