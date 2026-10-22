import { AbsoluteFill, Html5Audio, Series } from "remotion";

export const MyComposition = async ({
  verse,
}: {
  verse: { verse_text: string; verse_audio: string; duration: number }[];
}) => {
  return (
    <>
      <Series>
        {verse.map((val) => (
          <Series.Sequence durationInFrames={val.duration}>
            <AbsoluteFill className="text-7xl text-center justify-center font-uthmani font-black bg-white items-center leading-20">
              <div className="flex flex-col justify-center items-center gap-15 w-full">
                <div className="w-[80%] ">{val.verse_text}</div>
              </div>
            </AbsoluteFill>
            <Html5Audio src={val.verse_audio} volume={1} />
          </Series.Sequence>
        ))}
      </Series>
    </>
  );
};
