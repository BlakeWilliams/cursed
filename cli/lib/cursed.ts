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
      version: () => this.version(),
      "--version": () => this.version(),
      help: () => this.help(),
      "--help": () => this.help(),
      commands: () => this.listCommands(),
    };
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
        this.defaultCommands[commandName]();
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
    this.out.write(chalk`  help:      shows this message\n`);
    this.out.write(chalk`  version:   show cursed version\n`);
    this.out.write(
      chalk`  commands:  list all user and package defined commands\n`
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
