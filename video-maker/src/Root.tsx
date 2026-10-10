import "./index.css";
import { Composition, staticFile } from "remotion";
import { MyComposition } from "./Composition";

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
        calculateMetadata={async ({ props }) => {
          const data = await fetch(quranJson);
          const json = await data.json();

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
