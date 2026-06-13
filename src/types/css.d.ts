// CSS module declarations for tsc runs outside the Expo CLI (CI typecheck).
// Expo generates equivalents in expo-env.d.ts at runtime, but that file is gitignored.
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.css";
