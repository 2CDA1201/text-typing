/**
 * キュー構造を配列で実現するクラス
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

    /**
     * 要素を末尾に追加する
     * @param {*} element - プッシュする要素
     */
    push(element) {
        this._queue.push(element);
    }

    /**
     * 先頭の要素を取り出す
     * @returns {*} 先頭の要素を返す／キューが空の場合はnullを返す
     */
    pop() {
        if (this._queue.length === 0) {
            return null;
        }
        return this._queue.shift();
    }
}

// 定数
const STOCK_NUM = 5;
const ready_btn = document.getElementById("readyBtn");
const example_div = document.getElementById("exampleDiv");
const input_div = document.getElementById("inputDiv");

// 準備ボタンがクリックされたときに呼び出される
ready_btn.addEventListener("click", async () => {
    ready_btn.clickable = false;
    ready_btn.textContent = "準備中...";
    await fetchExampleText();
    
    ready_btn.style.display = "none";
    input_div.style.visibility = "visible";
    example_div.style.visibility = "visible";
    example_div.children[1].textContent = "3";

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
        loadNextExampleText();
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

// 例文を格納する変数
let exampleText = "";
let example_queue = new Queue();
/**
 * 入力された文字列と例文を比較し、入力状況を表示する
 */
function assessTypingProgress() {
    if (is_composing) return; // IME入力が確定されていないときは処理を中断

    let match_length = 0;
    for (; match_length < input_div.value.length; match_length++) {
        if (input_div.value[match_length] == exampleText[match_length]) {
            continue;
        } else {
            break;
        }
    }
    if (match_length == exampleText.length) {
        loadNextExampleText();
    } else {
        example_div.children[0].textContent = exampleText.slice(0, match_length);
        example_div.children[1].textContent = exampleText.slice(match_length, exampleText.length);
    }
};

/**
 * 次の例文を読み込む
 */
async function loadNextExampleText() {
    do {
        exampleText = example_queue.pop();
        if (exampleText === null) {
            await fetchExampleText();
            exampleText = example_queue.pop();
        }
    } while (exampleText === ""); // 空文字列の場合はもう一度取り出す
    input_div.value = "";
    example_div.children[0].textContent = "";
    example_div.children[1].textContent = exampleText;

    if (example_queue.length < STOCK_NUM) {
        fetchExampleText();
    }
}

/**
 * 例文を取得する
 */
async function fetchExampleText() {
    await fetch(`/application/generate?count=${STOCK_NUM}`)
        .then(response => response.text())
        .then(data => {
            let result = data;
            // 改行で分割して配列に格納
            let text_arr = result.split('\n').filter(text => text.trim() !== "");
            for (let i = 0; i < text_arr.length; i++) {
                example_queue.push(text_arr[i]);
            }
            console.log(example_queue);
        })
        .catch(error => {
            console.error('Error during Fetching:', error);
        });
};