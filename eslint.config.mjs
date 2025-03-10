import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "react/react-in-jsx-scope": "off", // Next.js'de React'ı import etmeye gerek yok
      "@typescript-eslint/no-explicit-any": "warn", // any tipini uyarı olarak işaretle
      "@typescript-eslint/no-empty-object-type": "warn", // boş nesne tiplerini uyarı olarak işaretle
      "@typescript-eslint/ban-ts-comment": "warn", // ts-ignore gibi yorumları uyarı olarak işaretle
      "@typescript-eslint/no-unused-vars": "warn", // kullanılmayan değişkenleri uyarı olarak işaretle
      "no-undef": "warn" // tanımlanmamış değişkenleri uyarı olarak işaretle
    }
  }
]; 