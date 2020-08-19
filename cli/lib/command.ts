export type CommandFn = (args: string[]) => void | Promise<any>;

interface ArgMap {
  [key: string]: string;
}

const ARG_REGEX = /^--(.*?)(=(.*)|$)/;

export default class Command {
  name: string;
  description: string;

  private flags: ArgMap = {};
  private positionalArgs: string[] = [];
  private handler?: CommandFn;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  flag(name: string, description: string): this {
    this.flags[name] = description;
    return this;
  }

  args(...args: string[]): this {
    this.positionalArgs = args;
    return this;
  }

  do(handler: CommandFn): this {
    this.handler = handler;
    return this;
  }

  async run(args: string[]) {
    let parsedArgs: any = {};
    let remainingArgs: string[] = [];

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      if (arg.startsWith("--")) {
        if (arg.match(ARG_REGEX)) {
          let [_all, name, _eqGroup, value] = arg.match(ARG_REGEX)!;

          if (name && value) {
            parsedArgs[name] = value;
          } else if (name) {
            parsedArgs[name] = true;
          }
        }
      } else {
        remainingArgs.push(arg);
      }
    }

    for (let i = 0; i < remainingArgs.length; i++) {
      const argValue = remainingArgs[i];
      const key = this.positionalArgs[i];

      if (key) {
        parsedArgs[key] = argValue;
      } else {
        break;
      }
    }

    await this.handler?.(parsedArgs);
  }

  get fullName() {
    let name = this.name;
    for (const posArg of this.positionalArgs) {
      name += ` <${posArg}>`;
    }

    if (this.flags.length) {
      name += " [flags]";
    }

    return name;
  }

  describe(description: string): this {
    this.description = description;
    return this;
  }
}
