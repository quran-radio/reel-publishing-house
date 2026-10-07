import { AbsoluteFill, Html5Audio, staticFile, useVideoConfig } from "remotion";

export const MyComposition = ({text}: {text: string}) => {
  const {fps} = useVideoConfig();
    return <>
    <AbsoluteFill  className="text-7xl text-center justify-center font-playpen font-black bg-white items-center leading-20">
      <div className="flex flex-col justify-center items-center gap-15 ">

      <div className="w-[80%] ">
      {text}

      </div>
      <div className="text-5xl font-semibold">
        By: Chat ibn GPT
      </div>
      </div>
    </AbsoluteFill>
    <Html5Audio src={staticFile("Illa Salati (Duo).mp3")} trimBefore={fps * 0} trimAfter={fps*7} volume={1}/>
    </>}