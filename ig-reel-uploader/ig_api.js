import process from "node:process";

export async function uploadReel(videoUrl, caption = "", audioName = "") {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `OAuth ${process.env.IG_TOKEN}`)

    const urlencoded = new URLSearchParams();
    urlencoded.append("media_type", "REELS");
    urlencoded.append("video_url", videoUrl);
    urlencoded.append("share_to_feed", true);
    urlencoded.append("is_ai_generated", true);
    urlencoded.append("caption", caption);
    urlencoded.append("audio_name", audioName);

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow"
    };

    const response = await fetch(`https://graph.instagram.com/v25.0/${process.env.IG_USER_ID}/media`, requestOptions)
    const ig_response = await response.json()
    console.log(`ig response `)
    console.log(ig_response)
    return ig_response;
}

export async function pollAndPublishContainer(containerId) {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    try {
        let count = 0;
        const timeoutNum = setInterval(async () => {
            const response = await fetch(`https://graph.instagram.com/${containerId}?fields=status_code&access_token=${process.env.IG_TOKEN}`, requestOptions);
            const result = await response.json();
            console.log(result)
            if (result.status_code == "FINISHED") {
                clearInterval(timeoutNum)
                await publishReel(containerId);
            }
            else if (count >= 180) {
                clearInterval(timeoutNum)
                console.log("reel container took too long to finish")
            }
            count += 1

        }, 1000
        )
    } catch (error) {
        console.error(error);
    };
}
export async function publishReel(reelId) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${process.env.IG_TOKEN}`);

    const raw = JSON.stringify({
        "creation_id": reelId
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    const response = await fetch(`https://graph.instagram.com/v25.0/${process.env.IG_USER_ID}/media_publish`, requestOptions)
    const ig_response = await response.json()
    console.log(`ig response `)
    console.log(ig_response)
    return ig_response
}