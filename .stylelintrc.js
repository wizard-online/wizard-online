module.exports = {
  extends: ["stylelint-config-recommended"],
  customSyntax: "postcss-styled-syntax",
  rules: {
    "value-no-vendor-prefix": true,
    "property-no-vendor-prefix": true,
    "no-empty-source": null,
  },
  ignoreFiles: [
    ".cache/**/*",
    "dist/**/*",
    "src/app/ui/components/Blinker.tsx",
  ],
};
