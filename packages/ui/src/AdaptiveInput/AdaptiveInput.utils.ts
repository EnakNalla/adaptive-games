import type {InputType, InputSize} from "@ag/db";
import eyeSymbol from "../assets/eye.png";
import mouseSymbol from "../assets/mouse.png";
import switchSymbol from "../assets/switch.png";
import touchSymbol from "../assets/touch.png";

export const images = new Map<InputType, {src: string; alt: string}>([
  [
    "SWITCH",
    {
      src: process.env.NODE_ENV === "test" ? (switchSymbol as unknown as string) : switchSymbol.src,
      alt: "Switch symbol"
    }
  ],
  [
    "EYEGAZE",
    {
      src: process.env.NODE_ENV === "test" ? (eyeSymbol as unknown as string) : eyeSymbol.src,
      alt: "Eye symbol"
    }
  ],
  [
    "MOUSE",
    {
      src: process.env.NODE_ENV === "test" ? (mouseSymbol as unknown as string) : mouseSymbol.src,
      alt: "Mouse symbol"
    }
  ],
  [
    "TOUCH",
    {
      src: process.env.NODE_ENV === "test" ? (touchSymbol as unknown as string) : touchSymbol.src,
      alt: "Touch symbol"
    }
  ]
]);

export const sizes = new Map<InputSize, {circle: string; img: string}>([
  ["SM", {circle: "6rem", img: "3rem"}],
  ["MD", {circle: "10rem", img: "5rem"}],
  ["LG", {circle: "14rem", img: "7rem"}]
]);

export const getRandomNumber = (min: number, max: number) => Math.random() * (max - min);
