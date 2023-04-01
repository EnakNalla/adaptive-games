import {type InputConfig} from "@ag/db";
import {useCallback, useEffect, useRef, type ReactNode} from "react";
import {getRandomNumber, images, sizes} from "./AdaptiveInput.utils";

interface InputContainerProps {
  children: ReactNode;
  fixedCentre?: boolean;
}

const InputContainer = ({children, fixedCentre}: InputContainerProps) => {
  const randomisePosition = useCallback((node: HTMLDivElement) => {
    if (!node || !node.parentElement) return;

    const x = getRandomNumber(node.clientWidth, node.parentElement.clientWidth);
    const y = getRandomNumber(node.clientHeight, node.parentElement.clientHeight);

    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
  }, []);

  return (
    <div style={{height: "100vh", width: "100vw", position: "absolute", top: 0, left: 0}}>
      <div
        ref={fixedCentre ? null : randomisePosition}
        className={fixedCentre ? "d-flex align-items-center h-100" : "position-absolute"}
      >
        {children}
      </div>
    </div>
  );
};

export interface AdaptiveInputProps extends InputConfig {
  onInput: () => void;
}

export const AdaptiveInput = ({
  type,
  size,
  onInput,
  fixedCentre,
  dwellTime,
  effectColour,
  borderColour
}: AdaptiveInputProps) => {
  const {circle, img} = sizes.get(size)!;
  const imgProps = images.get(type);
  const innerCircle = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  let timeout: number;

  const onMouseEnter = () => {
    if (!innerCircle.current) return;

    clearTimeout(timeout);

    innerCircle.current.style.animation = `grow-bg ${dwellTime}s linear backwards`;
    innerCircle.current.style.backgroundColor = effectColour;

    timeout = window.setTimeout(() => {
      onInput();
    }, dwellTime * 1000);
  };

  const onMouseLeave = () => {
    if (!innerCircle.current) return;

    clearTimeout(timeout);

    innerCircle.current.style.animation = "";
    innerCircle.current.style.backgroundColor = "";
  };

  useEffect(() => {
    if (!container.current) return;

    container.current.style.setProperty("border-color", borderColour, "important");
  }, [borderColour, container.current]);

  return (
    <InputContainer fixedCentre={type === "SWITCH" ? true : fixedCentre}>
      <div
        role={type === "MOUSE" || type === "TOUCH" ? "button" : ""}
        onClick={type === "MOUSE" || type === "TOUCH" ? onInput : undefined}
        onMouseEnter={type === "EYEGAZE" ? onMouseEnter : undefined}
        onMouseLeave={type === "EYEGAZE" ? onMouseLeave : undefined}
        style={{width: circle, height: circle, borderColor: `${borderColour} !important`}}
        className="position-relative border border-4 rounded-circle d-flex align-items-center text-center mx-auto overflow-hidden"
        ref={container}
      >
        <img
          {...imgProps}
          style={{width: img, height: img}}
          className="d-block mx-auto text-center"
        />
        {type === "EYEGAZE" && (
          <>
            <style>
              {`
                @keyframes grow-bg {
                  from { transform: scale(0); }
                  to { transform: scale(1); }
                }
              `}
            </style>

            <div
              ref={innerCircle}
              style={{width: circle, height: circle}}
              className="position-absolute rounded-circle opacity-75"
            />
          </>
        )}
      </div>
    </InputContainer>
  );
};
