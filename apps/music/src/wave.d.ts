declare module "@foobar404/wave" {
  class Wave {
    fromElement: (
      audioEl: string,
      canvasEl: string,
      options: {colors: string[]; type: string; stroke: number}
    ) => void;
  }

  export = Wave;
}
