#!/usr/bin/env node

import * as fs from "fs";
import cursed, { Command } from "../index";
import "ts-node/register";

import(process.cwd() + "/cursed.ts")
  .then(async (commands) => {
    for (const func of Object.values(commands)) {
      await (func as any)(cursed);
    }

    try {
      await cursed.run(process.argv);
    } catch (e) {
      console.log("Error running command");
      console.log(e);
      process.exit(1);
    }
  })
  .catch(async (e) => {
    if (fs.existsSync(process.cwd() + "/cursed.ts")) {
      console.error("Error loading cursed.ts");
      console.error(e);
    } else {
      console.log("Could not find cursed.ts file\n");
    }
    await cursed.run(process.argv);
  });
