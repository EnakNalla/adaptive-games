import {useConfig} from "~/store";
import Wave from "@foobar404/wave";
import {useCallback, useState} from "react";

const Visualiser = ({onClick}: {onClick: () => void}) => {
  const [wave] = useState(new Wave());
  const visualiserSettings = useConfig().visualiserSettings;

  const canvasSetup = useCallback((canvas: HTMLCanvasElement) => {
    if (!canvas) return;

    canvas.style.backgroundColor = visualiserSettings.colours.background;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    wave.fromElement("audio", "canvas", {
      type: visualiserSettings.type,
      stroke: visualiserSettings.stroke,
      colors: [
        visualiserSettings.colours.primary,
        visualiserSettings.colours.secondary,
        visualiserSettings.colours.tertiary,
        visualiserSettings.colours.quaternary
      ]
    });

    // TODO: hack as canvas doesn't display until clicked
    canvas.click();
  }, []);

  return (
    <canvas
      onClick={onClick}
      id="canvas"
      height="100%"
      width="100%"
      className="d-block w-100 h-100 position-absolute top-0 left-0 end-0 start-0"
      ref={canvasSetup}
    />
  );
};

export default Visualiser;
