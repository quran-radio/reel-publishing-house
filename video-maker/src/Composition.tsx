import { AbsoluteFill, Html5Audio, staticFile, useVideoConfig } from "remotion";

export const MyComposition = ({ data }) => {
  const { fps } = useVideoConfig();
  let verse = "";
  for (let i = 1; i < 5; i++) {
    verse += data[`1:1:${i}`].text;
    verse += " ";
  }
  return (
    <>
      <AbsoluteFill className="text-7xl text-center justify-center font-uthmani font-black bg-white items-center leading-20">
        <div className="flex flex-col justify-center items-center gap-15 w-full">
          <div className="w-[80%] ">{verse}</div>
        </div>
      </AbsoluteFill>
      {/* <Html5Audio
        src={staticFile("Illa Salati (Duo).mp3")}
        trimBefore={fps * 0}
        trimAfter={fps * 7}
        volume={1}
      /> */}
    </>
  );
};
