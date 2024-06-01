### AWS lambda用レイヤーファイル
1. `docker build -f entrypoint.dockerfile . -t mc2-entrypoint`
2. `docker run -v ./dist:/tmp mc2-entrypoint:latest /bin/bash /entrypoint.sh`
3. `dist`ディレクトリに`nodejs.zip`が出力される