# Text Typing

![Static Badge](https://img.shields.io/badge/-Node.js-gray?style=for-the-badge&logo=node.js)
![Static Badge](https://img.shields.io/badge/-HTML5-gray?style=for-the-badge&logo=html5)
![Static Badge](https://img.shields.io/badge/-CSS-gray?style=for-the-badge&logo=css&logoColor=blue)
![Static Badge](https://img.shields.io/badge/-JavaScript-gray?style=for-the-badge&logo=JavaScript)

## 使い方

### サーバーの準備と起動

[Node.js](https://nodejs.org/en/)をインストールする

カレントディレクトリが`package.json`のあるフォルダであることを確認し、以下のコマンドで依存関係をインストールする

`npm install`

`.env`ファイルにGemini APIのキーを設定する

`API_KEY=IamExampleAPIKey`

`.env`ファイルを作成後、以下のコマンドでサーバーを起動する

`node run start`

また、以下のコマンドで開発者モード(`nodemon`)でサーバーを起動する

`node run dev`

### 動作確認

http://localhost:3000 からアクセス

### サーバーの停止

コマンドラインを選択し、`Ctrl + C`でサーバーを停止できる
