import "./index.css";
import { Composition, staticFile } from "remotion";
import { MyComposition } from "./Composition";
import { Input, ALL_FORMATS, UrlSource } from "mediabunny";

export interface Info {
  [some: string]: string;
}

export interface WordByWord {
  [verse: string]: Info;
}

const fps = 30;

async function range_verse_getter(
  quranData: WordByWord,
  audioData: WordByWord,
  surah_number: number,
  start_verse: number,
  end_verse: number,
): Promise<{ verse_text: string; verse_audio: string; duration: number }[]> {
  /**
   * get a range of verses, for surah number, from start_verse to end_verse, inclusively
   * return an array, with each element containing the:
   * verse text
   * verse audio url
   * duration of verse in frames
   */
  const range_verse = [];

  // if we need to add a basmallah
  if (start_verse === 1 && surah_number !== 1 && surah_number !== 9) {
    const verseAudio = audioData[`${1}:${1}`];
    const input = new Input({
      formats: ALL_FORMATS,
      source: new UrlSource(verseAudio.audio_url),
    });
    const duration = await input.computeDuration();
    range_verse.push({
      // get basmallah from surah fatiha
      verse_text: verse_getter(quranData, 1, 1),
      verse_audio: verseAudio.audio_url,
      duration: duration * fps,
    });
    // remove the ayah number 1 from surah fatiha
    range_verse[0].verse_text = range_verse[0].verse_text
      .split(" ")
      .slice(0, 4)
      .join(" ");
  }

  // get verse obj fro each verse in range, including last one
  for (let i = start_verse; i <= end_verse; i++) {
    const verseAudio = audioData[`${surah_number}:${i}`];
    const input = new Input({
      formats: ALL_FORMATS,
      source: new UrlSource(verseAudio.audio_url),
    });

    const durationInSeconds = await input.computeDuration();
    range_verse.push({
      verse_text: verse_getter(quranData, surah_number, i),
      verse_audio: verseAudio.audio_url,
      duration: durationInSeconds * fps,
    });
  }

  return range_verse;
}

function verse_getter(
  data: WordByWord,
  surah_number: number,
  verse_number: number,
) {
  /**
   * get verse text for a specific verse, from JSON
   */

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

export const RemotionRoot: React.FC = () => {
  const surah = 76;
  const start_verse = 1;
  const end_verse = 7;

  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        width={1080}
        height={1920}
        defaultProps={{
          verses: [{ verse_text: "", verse_audio: "", duration: 0 }],
        }}
        calculateMetadata={async ({ props }) => {
          const quranJson = staticFile("/qpc-hafs-word-by-word.json");
          const audioJson = staticFile("/mishary-recitation.json");
          const quranResponse: Response = await fetch(quranJson);
          const audioResponse: Response = await fetch(audioJson);
          const quranData: WordByWord =
            (await quranResponse.json()) as WordByWord;
          const audioData: WordByWord =
            (await audioResponse.json()) as WordByWord;
          const verses = await range_verse_getter(
            quranData,
            audioData,
            surah,
            start_verse,
            end_verse,
          );
          let total_duration = 0;
          for (const v of verses) {
            total_duration += v.duration;
          }

          return {
            fps: fps,
            durationInFrames: Math.round(total_duration),
            props: {
              ...props,
              verses,
            },
          };
        }}
      />
    </>
  );
};
