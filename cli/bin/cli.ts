#!/usr/bin/env node

import cursed, { Command } from "../index";
import "ts-node/register";

import(process.cwd() + "/cursed")
  .then(async (commands) => {
    commands.default(cursed);
    try {
      await cursed.run(process.argv);
    } catch (e) {
      console.log("Error running command");
      console.log(e);
      process.exit(1);
    }
  })
  .catch(async (e) => {
    console.error("Error loading cursed.ts");
    console.error(e);
    await cursed.run(process.argv);
  });
