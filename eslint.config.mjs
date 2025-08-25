// @ts-check
import { defineConfig, globalIgnores } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginJest from "eslint-plugin-jest";

export default tseslint.config(
  defineConfig(globalIgnores(["dist/", "cdk.out/", "jest.config.js"])),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  // Source files configuration
  {
    files: ["src/**/*"],
    rules: {
      // Add any source-specific rules here
    },
  },

  // Test files configuration
  {
    files: ["test/**/*"],
    plugins: {
      jest: pluginJest,
    },

    languageOptions: {
      globals: {
        ...pluginJest.environments.globals.globals,
      },
    },
    rules: {
      ...pluginJest.configs.recommended.rules,
    },
  },
);
