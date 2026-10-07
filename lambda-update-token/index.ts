import { Octokit } from "@octokit/rest"
import sodium from "libsodium-wrappers"
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
    LambdaClient,
    UpdateFunctionConfigurationCommand,
    waitUntilFunctionUpdated,
} from "@aws-sdk/client-lambda";
import { readFileSync } from "node:fs";



export async function handler(event) {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    } as RequestInit;

    // refresh ig token
    let ig_token = "";
    try {
        const response = await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${process.env.IG_TOKEN}`, requestOptions);
        ig_token = (await response.json())['access_token']
        console.log(`Obtained IG Token with status code: ${response.status}`)
    } catch (error) {
        return error;
    };

    // refresh aws lambda ig token env variable
    const funcName = "ridgeway-warrior-secret-change"
    /** snippet-start:[javascript.v3.lambda.actions.UpdateFunctionConfiguration] */
    const client = new LambdaClient({});
    const command = new UpdateFunctionConfigurationCommand({
        Environment: { "Variables": { "IG_TOKEN": ig_token } },
        FunctionName: funcName,
    });
    const result = await client.send(command);
    waitUntilFunctionUpdated(
        {
            client: new LambdaClient({}),
            maxWaitTime: 60,
        },
        { FunctionName: funcName })
    console.log(`Updated lambda IG env variable with result:\n ${JSON.stringify(result)}`);

    // Octokit.js
    // https://github.com/octokit/core.js#readme
    const octokit = new Octokit({
        auth: process.env.GITHUB_PAT
    })

    // get github public key to encrypt ig token secret
    const public_key = await octokit.request('GET /orgs/{org}/actions/secrets/public-key', {
        org: 'ridgeway-warrior',
        headers: {
            'X-GitHub-Api-Version': '2026-03-10'
        }
    })

    console.log(`Obtained public key: \n${JSON.stringify(public_key)}`)

    // use libsodium to encrypt secret with public key
    await sodium.ready
    // Convert the secret and key to a Uint8Array.
    let binsec = sodium.from_string(ig_token)
    let binkey = sodium.from_base64(public_key.data.key, sodium.base64_variants.ORIGINAL)

    // Encrypt the secret using libsodium
    let encBytes = sodium.crypto_box_seal(binsec, binkey)

    // Convert the encrypted Uint8Array to Base64
    let output = sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL)

    // update secret in github 
    const response = await octokit.request('PUT /orgs/{org}/actions/secrets/{secret_name}', {
        org: 'ridgeway-warrior',
        secret_name: 'IG_TOKEN',
        encrypted_value: output,
        key_id: public_key.data.key_id,
        visibility: 'all',
        headers: {
            'X-GitHub-Api-Version': '2026-03-10'
        }
    })

    return response
}