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

export interface BasicAyahByAyah {
  [verse: string]: string;
}

const fps = 30;

async function range_verse_getter(
  quranData: WordByWord,
  audioData: WordByWord,
  quranTransliterationData: BasicAyahByAyah,
  quranTranslationData: WordByWord,
  surah_number: number,
  start_verse: number,
  end_verse: number,
): Promise<
  {
    verse: string;
    transliteration: string;
    translation: string;
    verse_audio: string;
    verse_number: number;
    duration: number;
  }[]
> {
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
    const { verse, transliteration, translation } = verse_getter(
      quranData,
      quranTransliterationData,
      quranTranslationData,
      1,
      1,
    );
    range_verse.push({
      // get basmallah from surah fatiha
      verse,
      transliteration,
      translation,
      verse_number: 0,
      verse_audio: verseAudio.audio_url,
      duration: duration * fps,
    });

    // remove the digit 1 (only needed for surah fatiha)
    range_verse[0].verse = range_verse[0].verse
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
    const { verse, transliteration, translation, verse_number } = verse_getter(
      quranData,
      quranTransliterationData,
      quranTranslationData,
      surah_number,
      i,
    );

    range_verse.push({
      verse,
      transliteration,
      translation,
      verse_number,
      verse_audio: verseAudio.audio_url,
      duration: durationInSeconds * fps,
    });
  }

  return range_verse;
}

function verse_getter(
  quranData: WordByWord,
  quranTransliterationData: BasicAyahByAyah,
  quranTranslationData: WordByWord,
  surah_number: number,
  verse_number: number,
) {
  /**
   * get verse text for a specific verse, from JSON
   */

  let word_exists = quranData[`${surah_number}:${verse_number}:${1}`];
  let verse = "";
  let i = 1;

  while (word_exists !== undefined) {
    verse += word_exists.text;
    verse += " ";
    i += 1;
    word_exists = quranData[`${surah_number}:${verse_number}:${i}`];
  }

  const transliteration =
    quranTransliterationData[`${surah_number}:${verse_number}`];
  const translation =
    quranTranslationData[`${surah_number}:${verse_number}`]["t"];

  return { verse, transliteration, translation, verse_number };
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
          verses: {
            surahMetadata: {},
            versesArr: [
              {
                verse: "",
                transliteration: "",
                translation: "",
                verse_audio: "",
                verse_number: 0,
                duration: 0,
              },
            ],
          },
        }}
        calculateMetadata={async ({ props }) => {
          const quranJson = staticFile("/qpc-hafs-word-by-word.json");
          const audioJson = staticFile("/mishary-recitation.json");
          const surahMetadata = staticFile("quran-metadata-surah-name.json");
          const quranTransliteration = staticFile(
            "en-transliteration-tajweed.json",
          );
          const quranTranslation = staticFile(
            "en-sahih-international-simple.json",
          );

          const quranResponse: Response = await fetch(quranJson);
          const audioResponse: Response = await fetch(audioJson);
          const surahMetadataResponse: Response = await fetch(surahMetadata);
          const quranTransliterationResponse: Response =
            await fetch(quranTransliteration);
          const quranTranslationResponse: Response =
            await fetch(quranTranslation);

          const quranData: WordByWord =
            (await quranResponse.json()) as WordByWord;
          const audioData: WordByWord =
            (await audioResponse.json()) as WordByWord;
          const surahMetadataData: WordByWord =
            (await surahMetadataResponse.json()) as WordByWord;
          const quranTransliterationData: BasicAyahByAyah =
            (await quranTransliterationResponse.json()) as BasicAyahByAyah;
          const quranTranslationData: WordByWord =
            (await quranTranslationResponse.json()) as WordByWord;

          const versesArr = await range_verse_getter(
            quranData,
            audioData,
            quranTransliterationData,
            quranTranslationData,
            surah,
            start_verse,
            end_verse,
          );

          let total_duration = 0;
          for (const v of versesArr) {
            total_duration += v.duration;
          }

          return {
            fps: fps,
            durationInFrames: Math.round(total_duration),
            props: {
              ...props,
              verses: {
                surahMetadata: surahMetadataData[surah.toString()],
                versesArr,
              },
            },
          };
        }}
      />
    </>
  );
};
