"use strict";
const BOOT_DIR = "!boot";
const BOOT_MODULE = [
  ".",
  BOOT_DIR,
  "Boot"
].join("/");

const Boot = importModule(BOOT_MODULE);
const ReadOnlyFile = importModule(
  "file/ReadOnlyFile"
);
const Bookmark = importModule(
  "file/Bookmark"
);
const Url = String("Url class WIP");
// const Url = importModule(
//   "url/Url"
// );

class System {
  static get config() {
    return JSON
    .parse(
      ReadOnlyFile
      .fromFile(
        this.systemDir,
        Boot.SYSTEM_CONFIG_FILE
      )
      ?.data
    )
    ?.system ?? new Object();
  }
  
  static get root() {
    return new ReadOnlyFile(
      new Bookmark(
        Boot.ROOT_BOOKMARK
      )
    );
  }
  
  static get bootDir() {
    return ReadOnlyFile.fromFile(
      this.root,
      BOOT_DIR
    );
  }
  
  static get systemDir() {
    return ReadOnlyFile.fromFile(
      this.root,
      Boot.SYSTEM_DIR
    );
  }
  
  static get configDir() {
    return ReadOnlyFile.fromFile(
      this.root,
      this
      .config
      .prod
      .dirs
      .config
    );
  }
  
  static get configSource() {
    const source = this
      .config
      .source
      .config
      .dir;
    return new ReadOnlyFile(
      new Bookmark(
        source?.bookmark ?? String()
      ),
      source?.subpath ?? String()
    );
  }
  
  static get libDir() {
    return ReadOnlyFile.fromFile(
      this.root,
      this
      .config
      .prod
      .dirs
      .lib
    );
  }
  
  static get libSource() {
    const source = this
      .config
      .source
      .lib
      .dir;
    return new ReadOnlyFile(
      new Bookmark(
        source?.bookmark ?? String()
      ),
      source?.subpath ?? String()
    );
  }
  
  static get dataDir() {
    return ReadOnlyFile.fromFile(
      this.root,
      this
      .config
      .prod
      .dirs
      .data
    );
  }
  
  static get programDir() {
    return ReadOnlyFile.fromFile(
      this.root,
      this
      .config
      .prod
      .dirs
      .program
    );
  }
  
  static get programSource() {
    const source = this
      .config
      .source
      .program
      .dir;
    return new ReadOnlyFile(
      new Bookmark(
        source?.bookmark ?? String()
      ),
      source?.subpath ?? String()
    );
  }
  
  static get protectedFilePrefix() {
    return String(
      this
      .config
      .prod
      .protected
      .filePrefix
    );
  }
  
  static get externalSecretsDir() {
    const ext = this
      .config
      .external
      .secrets
      .dir;
    return new ReadOnlyFile(
      new Bookmark(
        ext?.bookmark ?? String()
      ),
      ext?.subpath ?? String()
    );
  }
  
  static clean() {
    this.cleanConfigs();
    this.cleanLibraries();
    this.cleanPrograms();
  }
  
  static install() {
    this.clean();
    this.installConfigs();
    this.installLibraries();
    this.installPrograms();
  }
  
  static cleanConfigs() {
    
  }
  
  static installConfigs() {
    this.cleanConfigs();
    const fm = FileManager.iCloud();
    
    const here = this.configDir.path;
    const destination = here;
      
    const there = this.configSource.path;
    const source = there;
    
    if (fm.isDirectory(destination))
      fm.remove(destination);
      
    fm.copy(source, destination);
  }
  
  static cleanLibraries() {
    
  }
  
  static installLibraries() {
    this.cleanLibraries();
    const fm = FileManager.iCloud();
    
    const here = this.libDir.path;
    const destination = here;
      
    const there = this.libSource.path;
    const source = there;
    
    if (fm.isDirectory(destination))
      fm.remove(destination);
      
    fm.copy(source, destination);
  }
  
  static cleanPrograms() {
    
  }
  
  static installPrograms() {
    this.cleanPrograms();
    const confirm = new Alert();
    confirm.message = "Initializing scripts will delete all scripts currently shown. Are you sure you want to override current production files?";
    confirm.addDestructiveAction("Yes, DELETE prod");
    confirm.addCancelAction("No, cancel");
    confirm.present().then((value) => (pull(this, value)));
    
    function pull(
      system,
      value = -1
    ) {
      if (value === 0) {
        const fm = FileManager.iCloud();
        const here = system.programDir.path;
        const destination = here;
          
        const there = system.programSource.path;
        const source = there;
        
        const dScripts = fm
          .listContents(
            destination
          ).filter((leaf) => (
            !leaf.startsWith(system.protectedFilePrefix)
            && !(leaf === system.libDir.leaf)
            && !(leaf === system.bootDir.leaf)
            && !(leaf === system.dataDir.leaf)
            && !(leaf === system.configDir.leaf)
            && !(leaf === system.systemDir.leaf)
            && !(leaf === ".Trash")
          ));
        
        for (const leaf of dScripts) {
          const dFile = fm.joinPath(
            destination,
            leaf
          );
          console.log(dFile);
          fm.remove(dFile);
        }
        
        const sScripts = fm
          .listContents(
            source
          );
        
        for (const leaf of sScripts) {
          const sFile = fm.joinPath(
            source,
            leaf
          );
          const dFile = fm.joinPath(
            destination,
            leaf
          );
          console.log([sFile, dFile]);
          fm.copy(sFile, dFile);
        }
      }
    }
  }
}

const File = importModule(
  "file/File"
);
module.exports = System;
module.exports.Url = Url;
module.exports.File = File;
module.exports.ReadOnlyFile = ReadOnlyFile;
module.exports.Bookmark = Bookmark;
