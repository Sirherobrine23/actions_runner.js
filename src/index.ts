#!/usr/bin/env node
import yargs from "yargs";
import yaml from "yaml";
import path from "node:path";
import os from "node:os";
import { Check, CheckGit } from "./Checks.js";
const configPath = path.join(process.cwd(), ".runner.yaml"), cli = yargs(process.argv.slice(2)).help(true).alias("h", "help").strictOptions().demandCommand();

// config
cli.command("config", "Setup action", yargs => yargs.option("url", {
  type: "string",
  string: true,
  demandOption: false,
  default: "https://github.com/",
  description: "Repository, Organization or self hosted github url",
}).option("token", {
  type: "string",
  string: true,
  description: "Registration token"
}).option("name", {
  type: "string",
  string: true,
  default: os.hostname(),
  description: "Name of the runner to configure"
}).option("ephemeral", {
  type: "boolean",
  boolean: true,
  default: false,
  description: "Configure the runner to only take one job and then let the service un-configure the runner after the job finishes"
}).option("labels", {
  alias: ["l", "label"],
  string: true,
  array: true,
  description: "Extra labels in addition to the default",
  default: [`self-hosted,${process.platform},${process.arch}`],
}).option("work", {
  type: "string",
  string: true,
  default: path.join(process.cwd(), "_work")
}), async options => {
  options.labels = Array.from(new Set(options.labels.map(str => str.split(",")).flat(2))).map(str => str.trim());
  const { ephemeral, name, token, url, work, labels } = options;
  await Check(url);
  console.log(await CheckGit(url));
  console.log({ ephemeral, name, token, url, work, labels });
});

// run
cli.command("run", "Listener runner", yargs => yargs.option("check", {
  type: "boolean",
  boolean: true,
  default: true,
  description: "Check the runner's network connectivity with GitHub server"
}), async options => {

});

// Call
await cli.parseAsync();