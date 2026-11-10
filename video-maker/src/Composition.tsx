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
      <div className="px-16 py-36 bg-red-500 bg-clip-content w-full h-full">
        <div className="flex flex-col gap-70">
          <div className="w-full *:first:mb-8 text-6xl text-right">
            <div className="font-uthmani text-7xl bg-amber-700 ">
              سورة {surahMetadata["name_arabic"]}
            </div>
            <div className="font-serif bg-yellow-400 ">
              Surah {surahMetadata["name"]}
            </div>
          </div>
          <div className="w-full bg-orange-400 text-right align-bottom">
            <div className="w-[80%] float-right text-7xl font-uthmani font-black leading-30 bg-green-400">
              {verse_text}
            </div>
          </div>
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
