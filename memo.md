### aws-sdk v3への移行
layerを用意するのが面倒なので、esbuildを使ってバンドルしたい
aws-sdk v2だとこれくらい
```
❯ npm run build      

> discord-mc2-bot@0.1.0 build
> rm -rf dist && esbuild ./src/* --entry-names=[dir]/[name]/index --bundle --minify --sourcemap --platform=node --target=node16.14 --outdir=dist


  dist/entrypoint/index.js       9.1mb ⚠️
  dist/entrypoint/index.js.map  30.2mb

⚡ Done in 505ms
```
