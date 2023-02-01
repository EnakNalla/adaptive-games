declare module "*.png" {
  if (process.env.NODE_ENV === "test") {
    const content: {
      src: string;
    };

    export default content;
  }

  const content: string;
  export default content;
}
