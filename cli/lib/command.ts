export type CommandFn = (args: string[]) => void | Promise<any>;

export default class Command {
  name: string;
  options: string;
  description?: string;
  handler: CommandFn;

  constructor(name: string, handler: CommandFn) {
    const [commandName, ...options] = name.split(" ");
    this.name = commandName;
    this.options = options.join(" ");
    this.handler = handler;
  }

  run(args: string[]) {
    this.handler(args);
  }

  get fullName() {
    return [this.name, this.options].join(" ");
  }

  describe(description: string): this {
    this.description = description;
    return this;
  }
}
