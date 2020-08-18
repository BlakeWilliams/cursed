export type CommandFn = (args: string[]) => void | Promise<any>;

interface ArgMap {
  [key: string]: string;
}

export default class Command {
  name: string;
  description?: string;
  private boolFlags: ArgMap = {};
  private valFlags: ArgMap = {};
  private positionalArgs: string[] = [];
  private handler?: CommandFn;

  constructor(name: string, description: string) {
    this.name = name;
  }

  boolFlag(name: string, description: string): this {
    this.boolFlags[name] = description;
    return this;
  }

  valFlag(name: string, description: string): this {
    this.valFlags[name] = description;
    return this;
  }

  posArgs(...args: string[]): this {
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
        const argName = arg.replace(/^--/, "");

        if (Object.keys(this.valFlags).includes(argName)) {
          const nextArg = args[i + 1];

          if (!nextArg || nextArg.startsWith("--")) {
            throw new Error(
              `Expecteed ${argName} to be passed a value, received ${nextArg}`
            );
          }

          parsedArgs[argName] = nextArg;
          i++;
        } else if (Object.keys(this.boolFlags).includes(argName)) {
          parsedArgs[argName] = true;
        } else {
          remainingArgs.push(arg);
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

    if (this.boolFlags.length || this.valFlags.length) {
      name += " [flags]";
    }

    return name;
  }

  describe(description: string): this {
    this.description = description;
    return this;
  }
}
