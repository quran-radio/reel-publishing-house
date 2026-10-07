import { Octokit } from "octokit"

export async function handler(event) {

  // Octokit.js
  // https://github.com/octokit/core.js#readme
  const octokit = new Octokit({
    auth: process.env.GITHUB_PAT
  })

  const response = await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
    owner: "ridgeway-warrior",
    repo: 'ridgeway-warrior',
    workflow_id: 'send_reel.yml',
    ref: 'master',
    headers: {
      'X-GitHub-Api-Version': '2026-03-10'
    }
  })

  return response;

}