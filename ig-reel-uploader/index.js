import { uploadFile, getPresignedUrl } from "./cloudflare_r2_s3.js"
import { uploadReel, pollAndPublishContainer } from "./ig_api.js"
import path from "node:path";
import process from "node:process";
import { readFile } from "node:fs/promises";


const video_path = path.join(process.cwd(), "video.mp4")

const videoContent = await readFile(video_path)
const video_metadata = JSON.parse(await readFile(path.join(process.cwd(), "video_metadata.json"), "utf-8"))
const full_caption = video_metadata.caption + "\n\n" + video_metadata.hashtags.reduce((prev, curr) => prev + " " + curr)
const key = path.basename(video_path)
await uploadFile(videoContent, key)
const url = await getPresignedUrl(key)
const { id } = await uploadReel(url, full_caption, video_metadata.audio_name)
await pollAndPublishContainer(id)