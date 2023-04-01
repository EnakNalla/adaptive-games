import "bootstrap/dist/css/bootstrap.min.css";

export const parameters = {
  actions: {argTypesRegex: "^on[A-Z].*"},
  controls: {
    matchers: {
      color: /(background|color|borderColour|effectColour)$/i,
      date: /Date$/
    }
  },
  theme: {
    selector: "html",
    dataAttr: "data-bs-theme"
  }
};
