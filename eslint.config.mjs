import tseslint from "typescript-eslint";

export default tseslint.config(
  tseslint.configs.recommended,
  {
    ignores: [".next/**", "out/**", "node_modules/**"],
  }
);
