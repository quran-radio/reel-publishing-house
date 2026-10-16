import { AbsoluteFill, Html5Audio } from "remotion";
import { WordByWord } from "./Root";

export const MyComposition = ({ data }: { data: WordByWord }) => {
  const verse = range_verse_getter(data, 4, 5, 8);
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

function range_verse_getter(
  data: WordByWord,
  surah_number: number,
  start_verse: number,
  end_verse: number,
) {
  let range_verse = "";
  for (let i = start_verse; i < end_verse; i++) {
    range_verse += verse_getter(data, surah_number, i) + " ";
  }

  return range_verse;
}

function verse_getter(
  data: WordByWord,
  surah_number: number,
  verse_number: number,
) {
  let word_exists = data[`${surah_number}:${verse_number}:${1}`];
  let verse = "";
  let i = 1;

  while (word_exists !== undefined) {
    verse += word_exists.text;
    verse += " ";
    i += 1;
    word_exists = data[`${surah_number}:${verse_number}:${i}`];
  }

  return verse;
}
