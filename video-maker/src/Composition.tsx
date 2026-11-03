import { AbsoluteFill, Html5Audio, Series } from "remotion";

function VerseComp({
  verse_text,
  surahMetadata,
}: {
  verse_text: string;
  surahMetadata: object;
}) {
  return (
    <AbsoluteFill className=" text-center justify-center bg-white ">
      <div className="flex flex-col items-center gap-15 w-full">
        <div>
          <div className="text-5xl font-sans">{surahMetadata["name"]}</div>
          <div className="text-5xl font-uthmani p-6">
            {surahMetadata["name_arabic"]}
          </div>
        </div>
        <div className=" w-[80%] text-7xl font-uthmani font-black leading-30">
          {verse_text}
        </div>
      </div>
    </AbsoluteFill>
  );
}

export const MyComposition = ({
  verses,
}: {
  verses: {
    surahMetadata: object;
    versesArr: { verse_text: string; verse_audio: string; duration: number }[];
  };
}) => {
  return (
    <>
      <Series>
        {verses.versesArr.map((val) => (
          <Series.Sequence durationInFrames={val.duration}>
            <VerseComp
              verse_text={val.verse_text}
              surahMetadata={verses.surahMetadata}
            />
            <Html5Audio src={val.verse_audio} volume={1} />
          </Series.Sequence>
        ))}
      </Series>
    </>
  );
};
