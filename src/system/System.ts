class System {
  static get Shortcut(): typeof Shortcut {
    try {
      return importModule("Shortcut");
    } catch (e) {
      throw new ReferenceError(
        `System: Shortcut: Error importing Shortcut class: \n${e}`,
      );
    }
  }
}

module.exports = System;
