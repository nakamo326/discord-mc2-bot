import * as esbuild from "esbuild";
import * as glob from "glob";

const entryPoints = glob.sync("./src/*").map((file) => `./${file}`);
console.log(entryPoints);

await esbuild.build({
  entryPoints: entryPoints,
  entryNames: "[dir]/[name]/index",
  bundle: true,
  minify: true,
  sourcemap: true,
  platform: "node",
  target: ["node18"],
  external: ["@aws-sdk/*"],
  outdir: "dist",
});
