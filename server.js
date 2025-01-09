require("dotenv").config();
const http = require("http");
const fs = require("fs");
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Google Generative AI SDKをインポート
const URL = require("url");
const PORT = 3000;

const MIME_TYPE = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css'
};


const genAI = new GoogleGenerativeAI(process.env.API_KEY); // APIキーを設定してインスタンス化

async function generate(count) {
    const model = genAI.getGenerativeModel({model : "gemini-1.5-flash"}); // モデルを指定
    
    const prompt = `日本語の一つの文を${count}個生成せよ。日本語の文以外を出力した場合ペナルティがあります。生成する文は、多様な文体を交えること。生成した文と文の間には改行以外入れない事。`; // プロンプトを設定

    console.log("Generating content...");
    
    try {
        const result = await model.generateContent(prompt);
        console.log("Content generated successfully!");

        const response = result.response;
        const text = response.text();
        return text;
    } catch (error) {
        console.error("Error during generation:", error);
        throw error;
    }
}

const server = http.createServer(async function (request, response) {
    const parsedUrl = URL.parse(request.url, true);

    // /application/generateにGETリクエストが来たら、generate関数を呼び出し、結果を返す
    if (parsedUrl.pathname === '/application/generate' && request.method === 'GET') {
        const count = parseInt(parsedUrl.query.count) || 0; // クエリパラメータからcountを取得
        try {
            const result = await generate(count);
            response.writeHead(200, { 'Content-Type': 'text/plain' });
            response.end(result);
        } catch (error) {
            console.error('Error during generation:', error);
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.end('生成中にエラーが発生しました');
        }

        return;
    }

    // ファイル名と拡張子、またそのファイルのMIMEタイプを取得
    let filePath = '.' + request.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPE[extname] || 'application/octet-stream';

    // ファイルをロードしてレスポンスを返す
    fs.readFile(filePath, function (error, content) {
            if (error) {
                if (error.code === 'ENOENT') { // Error NO ENTry / ファイルが存在しない
                    fs.readFile('./404.html', (_error, page404) => {
                        response.writeHead(404, { 'Content-Type': 'text/html' });
                        response.end(page404, 'utf-8');
                    });
                } else {
                    response.writeHead(500);
                    response.end(`Server Error: ${error.code}`);
                }
            } else {
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content, 'utf-8');
            }
        });
});

server.listen(PORT, () => {
    if (process.env.API_KEY === undefined) {
        console.log("API Key is not set. Please set the API_KEY environment variable.");
    } else {
        console.log(`Server running at http://localhost:${PORT}`);
    }
});
