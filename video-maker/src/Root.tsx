import "./index.css";
import { Composition, staticFile } from "remotion";
import { MyComposition } from "./Composition";

export interface Info {
  [some: string]: string;
}

export interface WordByWord {
  [verse: string]: Info;
}

export const RemotionRoot: React.FC = () => {
  const quranJson = staticFile("/qpc-hafs-word-by-word.json");
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ data: {} }}
        calculateMetadata={async ({ props }) => {
          const data: Response = await fetch(quranJson);
          const json: WordByWord = (await data.json()) as WordByWord;

          return {
            props: {
              ...props,
              data: json,
            },
          };
        }}
      />
    </>
  );
};
