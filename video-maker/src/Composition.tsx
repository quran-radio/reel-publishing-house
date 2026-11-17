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
    <AbsoluteFill className=" text-center justify-center bg-white outline-10 -outline-offset-10 outline-black outline-solid">
      <div className="pl-30 pr-45 pt-72 pb-72 bg-clip-content w-full h-full">
        <div className="flex flex-col h-full justify-between ">
          <div className="w-full flex flex-col gap-8 text-5xl text-right">
            <div className="font-uthmani text-5xl ">
              سورة {surahMetadata["name_arabic"]}
            </div>
            <div className="font-serif ">Surah {surahMetadata["name"]}</div>
          </div>
          <div className="flex flex-col gap-8">
            <div className="w-full text-right align-bottom">
              <div className="w-[80%] float-right text-7xl font-uthmani font-black leading-30 ">
                {verse}
              </div>
            </div>
            <div className="w-full">
              <div className="font-serif text-5xl leading-15 text-right w-[80%] float-right">
                {/*remove digit from ayah number 0 (basmallah)*/}
                {verse_number === 0 ? undefined : `${verse_number}.`}{" "}
                {transliteration}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-8 ">
            <div className="text-[2.5rem] leading-15 text-left w-[80%]">
              {translation}
            </div>
            <div className="text-3xl text-left">(Sahih International)</div>
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
