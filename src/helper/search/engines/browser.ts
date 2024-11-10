import WebEngine from "./engine/web";
import type Query from "../query";

class BrowserEngine extends WebEngine<"browser"> {
  constructor(
    urls: Unflat,
    latlong: stringful,
    tags: Dyad<stringful>,
    separator?: string,
    encodeComponent?: boolean,
    force?: boolean,
    inprivate?: boolean,
  ) {
    super(
      "browser",
      typeof urls === "string" ? [urls] : urls,
      latlong,
      tags,
      separator,
      encodeComponent,
      force,
      inprivate,
    );
  }
}

export default BrowserEngine;
