import { AbsoluteFill, Html5Audio, Series } from "remotion";

function VerseComp({ verse_text }: { verse_text: string }) {
  return (
    <AbsoluteFill className=" text-center justify-center bg-white ">
      <div className="flex flex-col items-center gap-15 w-full">
        <div className="w-[80%] text-7xl font-uthmani font-black leading-30">
          {verse_text}
        </div>
      </div>
    </AbsoluteFill>
  );
}

export const MyComposition = ({
  verses,
}: {
  verses: { verse_text: string; verse_audio: string; duration: number }[];
}) => {
  return (
    <>
      <Series>
        {verses.map((val) => (
          <Series.Sequence durationInFrames={val.duration}>
            <VerseComp verse_text={val.verse_text} />
            <Html5Audio src={val.verse_audio} volume={1} />
          </Series.Sequence>
        ))}
      </Series>
    </>
  );
};
