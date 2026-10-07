import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { ridgeway_boss } from "./ai";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          text: ""
        }
        }
        calculateMetadata={async (props)=>{
          const boss_text = await ridgeway_boss();
          return {props: {
            text: boss_text.content.toString()}
          }
        }}
      />
    </>
  );
};
