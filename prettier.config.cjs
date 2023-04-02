module.exports = {
  arrowParens: "avoid",
  bracketSpacing: false,
  printWidth: 100,
  trailingComma: "none",
  plugins: [require.resolve("prettier-plugin-astro")],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro"
      }
    }
  ]
};
