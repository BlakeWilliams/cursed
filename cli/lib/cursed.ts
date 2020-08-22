import type { Writable } from "stream";
import chalk from "chalk";
import { version } from "../package.json";
import Command from "./command";

interface Commands {
  [key: string]: Command;
}

export default class Cursed {
  out: Writable;
  commands: Commands = {};
  done: boolean = true;

  constructor(out: Writable) {
    this.out = out;
  }

  addCommand(name: string, description: string) {
    const command = new Command(name, description);
    this.commands[command.name] = command;

    return command;
  }

  get defaultCommands(): any {
    return {
      init: (args: string[]) => this.init(args),
      version: () => this.version(),
      "--version": () => this.version(),
      help: () => this.help(),
      "--help": () => this.help(),
      commands: () => this.listCommands(),
    };
  }

  async init(args: string[]) {
    if (args.length == 0) {
      console.log(chalk`{red no packageName provided.}`);
      process.exit(1);
    }

    const packageName: string = args.shift()!;

    try {
      const pkg: any = await import(packageName);

      if (!pkg["cursedInit"]) {
        console.log(
          chalk`{yellow {bold ${packageName}} does not provide a \`cursedInit\` method}`
        );
        process.exit(1);
      }

      await pkg["cursedInit"](args);
    } catch (e) {
      console.log(chalk`{red could not import ${packageName}}`);
      console.log(e);
      process.exit(1);
    }
  }

  async run(args: string[]) {
    const _currentNode = args.shift();
    const _currentScript = args.shift();

    if (args.length == 0) {
      this.help();
      return;
    }

    const commandName = args.shift() as string;

    try {
      this.keepalive();

      if (this.defaultCommands[commandName]) {
        this.defaultCommands[commandName](args);
      } else if (this.commands[commandName]) {
        this.commands[commandName].run(args);
      } else {
        this.out.write(chalk`{red command "${commandName}" not found\n\n}`);
        this.help();
        process.exit(1);
      }
    } finally {
      this.stopKeepalive();
    }
  }

  listCommands() {
    this.help();
    this.out.write(chalk`\n{bold DEFINED COMMANDS}\n`);
    const commands = Object.values(this.commands);
    const maxNameWidth = Math.max(...commands.map((c) => c.fullName.length));

    commands.forEach((command) => {
      this.out.write(`  ${command.fullName}`);
      if (command.description) {
        this.out.write(`${" ".repeat(maxNameWidth - command.fullName.length)}`);
        this.out.write(chalk` {gray # ${command.description}\n}`);
      }
    });
  }

  help() {
    this.out.write(chalk`{bold USAGE}\n`);
    this.out.write(chalk`  cursed <command> [flags]\n\n`);
    this.out.write(chalk`{bold CORE COMMANDS}\n`);
    this.out.write(
      chalk`  init <package>  {gray # creates setup for given package}\n`
    );
    this.out.write(chalk`  help <command>  {gray # shows help message}\n`);
    this.out.write(chalk`  version         {gray # show cursed version}\n`);
    this.out.write(
      chalk`  commands        {gray # list cursed.ts defined commands} \n`
    );
  }

  version() {
    this.out.write(chalk`cursed version {yellow ${version}}\n`);
  }

  keepalive() {
    this.done = false;
    setTimeout(() => {
      if (!this.done) this.keepalive();
    }, 100);
  }

  stopKeepalive() {
    this.done = true;
  }
}
