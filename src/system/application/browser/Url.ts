class Url {
  #scheme: Scheme = new Url._Scheme("https");
  #host: Host = new Url._Host();
  #port: Port = new Url._Port();
  #path: Path = new Url._Path();
  #query: Query = new Url._Query();
  #fragment: Fragment = new Url._Fragment();

  constructor(url?: Url);
  constructor(urlparts?: Url.UrlParts);
  constructor(url?: string);
  constructor(
    scheme?: string | Scheme,
    host?: string | Host,
    port?: string | number | Port,
    path?: string | Path,
    query?: string | Query,
    fragment?: string | Fragment
  );

  constructor(
    head?:
      string
      | Scheme
      | Url
      | Url.UrlParts,
    host?: string | Host,
    port?: string | number | Port,
    path?: string | Path,
    query?: string | Query,
    fragment?: string | Fragment
  ) {
    if (head === undefined) {}
    else if (head instanceof Url) {
      const url: Url = head;
      this.scheme = url.scheme;
      this.host = url.host;
      this.port = url.port;
      this.path = url.path;
      this.query = url.query;
      this.fragment = url.fragment;
    }
    else if (typeof head === "string") {
      if (host === undefined
        && port === undefined
        && path === undefined
        && query === undefined
        && fragment === undefined
      ) {
        const url: string = head;
        const parsedUrl: Url = this.parse(url);
        this.scheme = parsedUrl.scheme;
        this.host = parsedUrl.host;
        this.port = parsedUrl.port;
        this.path = parsedUrl.path;
        this.query = parsedUrl.query;
        this.fragment = parsedUrl.fragment;
      }
      else {
        const scheme: string = head;
        this.scheme = scheme;
        this.host = host;
        this.port = port;
        this.path = path;
        this.query = query;
        this.fragment = fragment;
      }
    }
    else if (
      "ClassDecorator_UrlPart" in head
    ) {
      const scheme: Scheme = head;
      this.scheme = scheme;
      this.host = host;
      this.port = port;
      this.path = path;
      this.query = query;
      this.fragment = fragment;
    }
    else {
      const urlParts: Url.UrlParts = head;
      this.scheme = urlParts.scheme;
      this.host = urlParts.host;
      this.port = urlParts.port;
      this.path = urlParts.path;
      this.query = urlParts.query;
      this.fragment = urlParts.fragment;
    }
  }

  get scheme(): string {
    return this.#scheme.toString();
  }

  set scheme(
    scheme: (string
      | Scheme
      | undefined
      | null
    )
  ) {
    this.#scheme = new Url._Scheme(
      scheme
    );
    if (this.scheme === "")
      this.#scheme = new Url._Scheme(
        "https"
      );
  }

  get host(): string {
    return this.#host.toString();
  }

  set host(
    host: (string
      | Host
      | undefined
      | null
    )
  ) {
    this.#host = new Url._Host(host);
  }

  get port(): string {
    return this.#port.toString();
  }

  set port(
    port: (string
      | number
      | Port
      | undefined
      | null
    )
  ) {
    this.#port = new Url._Port(port);
  }

  get path(): string {
    return this.#path.toString();
  }

  set path(
    path: (string
      | Path
      | undefined
      | null
    )
  ) {
    this.#path = new Url._Path(path);
  }

  get query(): string {
    return this.#query.toString();
  }

  set query(
    query: (string
      | Query
      | undefined
      | null
    )
  ) {
    this.#query = new Url._Query(query);
  }

  addParam(
    keyOrKeyValue:
      string
      | [string, string],
    value?: string
  ): void {
    this.query = this.#query.addParam(keyOrKeyValue, value);
  }

  deleteParam(
    key: string
  ): void {
    this.addParam(key, "");
  }

  get fragment(): string {
    return this.#fragment.toString();
  }

  set fragment(
    fragment: (string
      | Fragment
      | undefined
      | null
    )
  ) {
    this.#fragment = new Url._Fragment(
      fragment
    );
  }
  
  open(): void {
    Safari.open(this.url);
  }
  
  webview(fullScreen: boolean = false): void {
    WebView.loadURL(
      this.url,
      undefined,
      fullScreen
    );
  }
  
  get isValid(): boolean {
    return this.#scheme.isValid;
  }
  
  get url(): string {
    return this.isValid ?
      new Url._SchemeHostPortPathQueryFragment([
      this.#scheme,
      this.#host,
      this.#port,
      this.#path,
      this.#query,
      this.#fragment
      ]).toString();
      : "";
  }
  
  private parse(url: string): Url {
      let urlStringParts: Url.UrlParts = {};

      const url_fragment: string[] = url
        .trim()
        .split("#");
      url = url_fragment.shift() ?? "";
      urlStringParts.fragment = url_fragment.join("#");

      const queryOrSchemehostportpath_query: string[] = url.split("?");
      const queryOrSchemehostportpath: string = queryOrSchemehostportpath_query.shift() ?? "";
      const schemehostportpath: string = queryOrSchemehostportpath.includes("=") ?
        ""
        : queryOrSchemehostportpath;
      urlStringParts.query = queryOrSchemehostportpath.includes("=") ?
        [
          queryOrSchemehostportpath,
          ...queryOrSchemehostportpath_query
        ].join("?")
        : queryOrSchemehostportpath_query.join("?");

      const scheme_hostportpath: string[] = schemehostportpath.split("://");
      const schemeOrHostportpath: string = scheme_hostportpath.shift() ?? "";
      urlStringParts.scheme = scheme_hostportpath.length > 0 ?
        schemeOrHostportpath
        : (schemeOrHostportpath.includes(".")
          || schemeOrHostportpath.includes("/")) ?
          ""
          : schemeOrHostportpath;
      const hostportpath: string = scheme_hostportpath.length > 0 ?
        scheme_hostportpath.join("://")
        : urlStringParts.scheme === "" ?
          schemeOrHostportpath
          : "";

      const hostport_path: string[] = Url._File
        .trimPath(hostportpath)
        .split("/");
      const hostport: string = hostport_path.shift() ?? "";
      urlStringParts.path = hostport_path.join("/");

      const host_port: string[] =
        hostport.split(":");
      urlStringParts.host = host_port.shift() ?? "";
      urlStringParts.port = urlStringParts.host === "" ?
        ""
        : host_port.join(":");

      return new Url(urlStringParts);
    }

  toString(): string {
    return this.url;
  }

  static encode(
    url: string
  ): string {
    return encodeURI(url.trim())
      ?.trim()
      ?? String();
  }

  static decode(
    url: string
  ): string {
    return decodeURI(url.trim())
      ?.trim()
      ?? String();
  }

  static encodePart(
    part: string
  ): string {
    return encodeURIComponent(
      part.trim()
    )
      ?.trim()
      ?? String();
  }

  static decodePart(
    part: string
  ): string {
    return decodeURIComponent(
      part.trim()
    )
      ?.trim()
      ?? String();
  }
}

namespace Url {
  export interface UrlParts {
    scheme?: string | Scheme,
    host?: string | Host,
    port?: string | number | Port,
    path?: string | Path,
    query?: string | Query,
    fragment?: string | Fragment
  };

  export const _File: typeof File = importModule("./system/application/appdata/filesystem/file/File");

  export const _Scheme: typeof Scheme = importModule("urlcomposites/urlparts/Scheme");
  export const _Host: typeof Host = importModule("urlcomposites/urlparts/Host");
  export const _Port: typeof Port = importModule("urlcomposites/urlparts/Port");
  export const _Path: typeof Path = importModule("urlcomposites/urlparts/Path");
  export const _Query: typeof Query = importModule("urlcomposites/urlparts/Query");
  export const _Fragment: typeof Fragment = importModule("urlcomposites/urlparts/Fragment");
  export const _SchemeHostPortPathQueryFragment: typeof SchemeHostPortPathQueryFragment = importModule("urlcomposites/SchemeHostPortPathQueryFragment");
}

module.exports = Url;
