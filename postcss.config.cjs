module.exports = {
  plugins: [
    require("postcss-import"),
    // require("tailwindcss/nesting")(require("postcss-nesting")), // doesn't work with &_sub selectors
    require("tailwindcss/nesting"),
    require("tailwindcss"),
    require("autoprefixer"),
  ],
};
