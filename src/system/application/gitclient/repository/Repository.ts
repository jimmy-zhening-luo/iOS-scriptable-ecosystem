abstract class Repository {

  private readonly callbackBase: Callback;
  private readonly paramIdToKey:
    Map<
      Repository.Command,
      Map<
        Repository.Param,
        string
      >
    >;

  constructor(
    scheme: string,
    host: string,
    secretParamName: string,
    secret: string,
    repoParamName: string,
    repo: string,
    commandConfigs: Repository.CommandConfigMap
  ) {
    this.callbackBase = new Repository.Callback(
      scheme,
      host,
      [
        [
          secretParamName,
          secret
        ],
        [
          repoParamName,
          repo
        ],
      ],
      this.configureCommands(
        commandConfigs,
        secretParamName,
        repoParamName
      )
    );
    this.paramIdToKey = this.mapParamIdsToKeys(
      commandConfigs
    );
  }

  private configureCommands(
    commandConfigMap: Repository.CommandConfigMap,
    secretParamName: string,
    repoParamName: string
  ):
    Record<
      string,
      Callback.ActionConfig
    > {
    const actionMap:
      Map<
        string,
        Callback.ActionConfig
      > = new Map();

    for (const command in Repository.Command) {
      const config: Repository.CommandConfig = commandConfigMap[
        Repository.Command[command as keyof typeof Repository.Command]];
      actionMap.set(
        command,
        {
          path: config.path,
          queryRoot: config.query,
          requiredParams: [
            secretParamName,
            repoParamName,
          ]
        }
      );
    }

    return Object.fromEntries(
      Array.from(
        actionMap.entries()
      )
    );
  }

  private mapParamIdsToKeys(
    commandConfigMap: CommandConfigMap
  ): typeof Repository.prototype.paramIdToKey {
    const keyMap: Map<Callback.Param, string> = new Map();
    for (const command in Repository.Command) {
      const config: CommandConfig = commandConfigMap[command];
      actionMap[command.toString()] = {
        path: config.path,
        queryRoot: config.query,
        requiredParams?: {

        }
      }
    }
  }

  protected executeCommand(
    command: Repository.Command,
    params: Partial<Record<Repository.CommandParam, string>> = {}
  ): any {
    this.callbackBase.requestAction(
      command.toString(),
      new Map(
        Array.from(
          Object.entries(
            params
          )
        ).map(([paramId, paramValue]) => (
          [
            paramId,
            paramValue
          ]
        ))
      )
    );
  }

  checkout(
    branch: string
  ): any {
    return this.executeCommand(
      Repository.Command.Checkout,
      {
        [Repository.Param.Branch]: branch
      }
    );
  }

  pull(): any {
    return this.executeCommand(
      Repository.Command.Pull
    );
  }

  commit(
    message: string
  ): any {
    return this.executeCommand(
      Repository.Command.Commit,
      {
        [Repository.Param.Message]: message
      }
    );
  }

  push(): any {
    return this.executeCommand(
      Repository.Command.Push
    );
  }

  get Callback(): typeof Callback {
    return Repository.Callback;
  }

  static get Callback(): typeof Callback {
    return importModule("./system/application/browser/Callback");
  }

}

namespace Repository {

  // Action type
  export enum Command {
    Checkout,
    Pull,
    Commit,
    Push
  }

  // Param type
  export enum Param {
    Repo,
    Secret,
    Branch,
    Message,
    Limit
  }

  export type StaticParam =
    | Param.Repo
    | Param.Secret;

  export type CommandParam =
    | Param.Branch
    | Param.Message

  // Command Config
  export interface CommandConfigInterface {
    readonly path: string,
    readonly query: string,
    readonly otherRequiredParamKeys?: Partial<Record<CommandParam, string>>,
    readonly optionalParamKeys?: Partial<Record<CommandParam, string>>
  }

  export abstract class CommandConfig implements CommandConfigInterface {

    readonly path: string;
    readonly query: string;
    readonly otherRequiredParamKeys?: Partial<Record<CommandParam, string>>;
    readonly optionalParamKeys?: Partial<Record<CommandParam, string>>;

    constructor(
      path: string,
      query: string,
      otherRequiredParamKeys: Partial<Record<CommandParam, string>> = {},
      optionalParamKeys: Partial<Record<CommandParam, string>> = {}
    ) {
      this.path = path;
      this.query = query;
      this.otherRequiredParamKeys = otherRequiredParamKeys;
      this.optionalParamKeys = optionalParamKeys;
    }
  }

  export class CheckoutConfig extends CommandConfig {
    constructor(
      path: string,
      query: string,
      otherRequiredParamKeys: {
        [Param.Branch]: string
      }
    ) {
      super(
        path,
        query,
        otherRequiredParamKeys
      );
    }
  }

  export class PullConfig extends CommandConfig {
    constructor(
      path: string,
      query: string,
    ) {
      super(
        path,
        query
      );
    }
  }

  export class CommitConfig extends CommandConfig {
    constructor(
      path: string,
      query: string,
      otherRequiredParamKeys: {
        [Param.Message]: string
      }
    ) {
      super(
        path,
        query,
        otherRequiredParamKeys
      );
    }
  }

  export class PushConfig extends CommandConfig {
    constructor(
      path: string,
      query: string,
    ) {
      super(
        path,
        query
      );
    }
  }

  export type CommandConfigMapType = Required<Record<Command, CommandConfig>>;

  export interface CommandConfigMap extends CommandConfigMapType {
    [Command.Checkout]: CheckoutConfig,
    [Command.Pull]: PullConfig,
    [Command.Commit]: CommitConfig,
    [Command.Push]: PushConfig
  }

}

module.exports = Repository;
