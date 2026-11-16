import { AbsoluteFill, Html5Audio, Series } from "remotion";

function VerseComp({
  verse,
  transliteration,
  translation,
  verse_number,
  surahMetadata,
}: {
  verse: string;
  transliteration: string;
  translation: string;
  verse_number: number;
  surahMetadata: object;
}) {
  return (
    <AbsoluteFill className=" text-center justify-center bg-white ">
      <div className="px-16 pt-36 pb-60 bg-red-500 bg-clip-content w-full h-full">
        <div className="flex flex-col h-full justify-between bg-pink-400">
          <div className="w-full flex flex-col gap-8 text-6xl text-right">
            <div className="font-uthmani text-7xl bg-amber-700 ">
              سورة {surahMetadata["name_arabic"]}
            </div>
            <div className="font-serif bg-yellow-400 ">
              Surah {surahMetadata["name"]}
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div className="w-full bg-orange-400 text-right align-bottom">
              <div className="w-[80%] float-right text-7xl font-uthmani font-black leading-30 bg-green-400">
                {verse}
              </div>
            </div>
            <div className="w-full">
              <div className="font-serif text-6xl text-right w-[80%] float-right">
                {/*remove digit from ayah number 0 (basmallah)*/}
                {verse_number === 0 ? undefined : `${verse_number}.`}{" "}
                {transliteration}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-8 ">
            <div className="text-6xl text-left w-[80%]">{translation}</div>
            <div className="text-4xl text-left">(Sahih International)</div>
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
    versesArr: {
      verse: string;
      transliteration: string;
      translation: string;
      verse_audio: string;
      verse_number: number;
      duration: number;
    }[];
  };
}) => {
  return (
    <>
      <Series>
        {verses.versesArr.map((val) => (
          <Series.Sequence durationInFrames={val.duration}>
            <VerseComp
              verse={val.verse}
              verse_number={val.verse_number}
              transliteration={val.transliteration}
              translation={val.translation}
              surahMetadata={verses.surahMetadata}
            />
            <Html5Audio src={val.verse_audio} volume={1} />
          </Series.Sequence>
        ))}
      </Series>
    </>
  );
};
