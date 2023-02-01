import eyeSymbol from "../assets/eye.png";
import mouseSymbol from "../assets/mouse.png";
import switchSymbol from "../assets/switch.png";
import touchSymbol from "../assets/touch.png";
import {InputSize, InputType} from "./AdaptiveInput.types";

export const images = new Map<InputType, {src: string; alt: string}>([
  [
    "switch",
    {
      src: process.env.NODE_ENV === "test" ? (switchSymbol as unknown as string) : switchSymbol.src,
      alt: "Switch symbol"
    }
  ],
  [
    "eyeGaze",
    {
      src: process.env.NODE_ENV === "test" ? (eyeSymbol as unknown as string) : eyeSymbol.src,
      alt: "Eye symbol"
    }
  ],
  [
    "mouse",
    {
      src: process.env.NODE_ENV === "test" ? (mouseSymbol as unknown as string) : mouseSymbol.src,
      alt: "Mouse symbol"
    }
  ],
  [
    "touch",
    {
      src: process.env.NODE_ENV === "test" ? (touchSymbol as unknown as string) : touchSymbol.src,
      alt: "Touch symbol"
    }
  ]
]);

export const sizes = new Map<InputSize, {circle: string; img: string}>([
  ["sm", {circle: "6rem", img: "3rem"}],
  ["md", {circle: "10rem", img: "5rem"}],
  ["lg", {circle: "14rem", img: "7rem"}]
]);

export const getRandomNumber = (min: number, max: number) => Math.random() * (max - min);
