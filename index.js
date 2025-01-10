/**
 * キュー構造を配列で実現するクラス
 * @function enqueue - 一つの要素をキューに追加
 * @function dequeue - 一つの要素をキューから取り出す
 * @property {number} length - キューの長さ
 */
class Queue {
    /**
     * キューを作成する
     */
    constructor() {
        this._queue = [];
    }

    get length() {
        return this._queue.length;
    }

    /**^
     * キューに要素を入れる
     * @param {*} element - プッシュする要素
     */
    enqueue(element) {
        this._queue.push(element);
    }

    /**
     * キューから要素を取り出す
     * @returns {*} 先頭の要素を返す／キューが空の場合はnullを返す
     */
    dequeue() {
        if (this._queue.length === 0) {
            return null;
        }
        return this._queue.shift();
    }
}

const STOCK_TARGET = 20; // お題のストック数

// DOM要素
const ready_btn = document.getElementById("readyBtn");
const preview_div = document.getElementById("previewDiv");
const example_div = document.getElementById("exampleDiv");
const input_div = document.getElementById("inputDiv");

let is_ready_btn_clicked = false; // 準備ボタンがクリックされたかどうかを示すフラグ
// 準備ボタンがクリックされたときに呼び出される
ready_btn.addEventListener("click", async () => {
    // 一回目以降のクリックは無視
    if (is_ready_btn_clicked) return;
    is_ready_btn_clicked = true;

    ready_btn.textContent = "準備中...";
    await fetchExampleText();
    
    ready_btn.style.display = "none";
    input_div.style.visibility = "visible";
    example_div.style.visibility = "visible";
    example_div.children[1].textContent = "3";

    // カウントダウン
    setTimeout(() => {
        example_div.children[1].textContent = "2";
    }, 1000)
    setTimeout(() => {
        example_div.children[1].textContent = "1";
    }, 2000);
    setTimeout(() => {
        example_div.children[1].textContent = "0";
    }, 3000);
    setTimeout(() => {
        example_div.style.textAlign = "left";
        loadNextExampleText(true);
        preview_div.style.visibility = "visible";
    }, 4000);
});

// 入力された文字列が変更されたときに呼び出される
input_div.addEventListener("input", assessTypingProgress);
let is_composing = false; // IME入力が確定されていないかどうかを示すフラグ
// 日本語IME等の変換セッションが開始された
input_div.addEventListener('compositionstart', () => {
    is_composing = true;
});
// 日本語IME等の変換セッションが終了した
input_div.addEventListener('compositionend', () => {
    is_composing = false;
    assessTypingProgress();
});

// お題を格納する変数
let example_text = "";
let example_queue = new Queue();

/**
 * 入力された文字列とお題を比較し、入力状況を表示する
 */
function assessTypingProgress() {
    if (is_composing) return; // IME入力が確定されていないときは処理を中断

    let match_length = 0;
    let temp_text = example_div.innerText;
    // 一致している文字数を数える
    for (; match_length < input_div.value.length; match_length++) {
        if (input_div.value[match_length] == temp_text[match_length]) {
            continue;
        } else {
            break;
        }
    }

    if (match_length == temp_text.length) { // お題をクリアしたとき
        loadNextExampleText(); // 次のお題を読み込む
    } else { // お題をクリアしていないとき
        example_div.children[0].textContent = temp_text.slice(0, match_length);
        example_div.children[1].textContent = temp_text.slice(match_length, temp_text.length);
    }
};

/**
 * 次のお題を読み込む
 */
async function loadNextExampleText(is_first = false) {
    // お題が`STOCK_NUM`の半分以下になったら非同期で追加取得
    if (example_queue.length < STOCK_TARGET / 2) {
        fetchExampleText();
    }
    // 入力欄をクリア
    input_div.value = "";

    // お題を読み込む
    if (is_first) { // 初回のみ
        example_text = example_queue.dequeue();
        example_div.children[0].textContent = "";
        example_div.children[1].textContent = example_text;
        example_text = example_queue.dequeue();
        preview_div.children[0].textContent = "";
        preview_div.children[1].textContent = example_text;
    } else { // 2回目以降
        example_text = example_queue.dequeue();
        example_div.children[0].textContent = "";
        example_div.children[1].textContent = preview_div.children[1].textContent;
        preview_div.children[0].textContent = "";
        preview_div.children[1].textContent = example_text;
    }
}

/**
 * お題を `count` 個取得してキューに追加する
 * @param {number} count - 取得するお題の数 (デフォルト: `STOCK_NUM`)
 */
async function fetchExampleText(count = null) {
    await fetch(`/application/generate?count=${count ? count : STOCK_TARGET}`)
        .then(response => response.text())
        .then(data => {
            let result = data;
            // 改行で分割して配列に格納
            let text_arr = result.split('\n').filter(text => text.trim() !== "");
            // お題をキューに追加
            for (let i = 0; i < text_arr.length; i++) {
                example_queue.enqueue(text_arr[i]);
            }
        })
        .catch(error => {
            console.error('Error during Fetching:', error);
        });
};