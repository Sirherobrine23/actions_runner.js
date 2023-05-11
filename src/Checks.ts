import { http } from "@sirherobrine23/http";
import { execFile } from "child_process";

export async function Check(githubUrl: string) {
  const ghURL = new URL(githubUrl);
  let zen: string, vstoken: string, pipelines: string;
  if (ghURL.hostname === "github.com") {
    zen = "https://api.github.com/api/v3/zen";
    vstoken = "https://vstoken.actions.githubusercontent.com/_apis/health";
    pipelines = "https://pipelines.actions.githubusercontent.com/_apis/health";
  } else {
    zen = `${ghURL.origin}/api/v3/zen`;
    vstoken = `${ghURL.origin}/_services/vstoken/_apis/health`;
    pipelines = `${ghURL.origin}/_services/pipelines/_apis/health`;
  }

  for (const urlTest of [zen, vstoken, pipelines]) {
    const res = await http.dummyRequest(urlTest);
    if (!(res.headers["x-github-request-id"]||res.headers["x-vss-e2eid"])) throw new Error("Check valid github repository.");
  }

  return {
    zen, vstoken, pipelines
  };
}

export async function CheckGit(githubURL = "https://github.com"): Promise<{[sha: string]: string}> {
  return new Promise((done, reject) => {
    // git ls-remote --exit-code https://github.com/actions/checkout HEAD
    execFile("git", ["ls-remote", "--exit-code", (new URL("/actions/checkout", githubURL).toString())], {maxBuffer: Infinity}, (error, out, err) => {
      if (error) return reject(error);
      const std = (out.toString()||err.toString()||"").trim();
      done(std.split("\n").reduce<{[sha: string]: string}>((acc, data) => {
        acc[data.slice(0, data.indexOf("\t"))] = data.slice(data.indexOf("\t")+1);
        return acc;
      }, {}));
    });
  });
}