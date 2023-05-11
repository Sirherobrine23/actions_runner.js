import child_process from "node:child_process";

export function runJob(command: string, option: {cwd: string, env?: {[envName: string]: string}}) {
  const spawner = child_process.spawn(command, {
    cwd: option.cwd,
    env: {
      ...process.env,
      ...option.env,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  return spawner;
}

export function runAction(type: "node18"|"docker"|"composite", config: any) {
  if (type === "composite") {

  } else if (type === "docker") {

  } else if (type === "node18") {
    
  } else throw new Error("Invalid type");
}