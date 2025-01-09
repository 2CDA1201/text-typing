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

const STOCK_NUM = 5;
const ready_btn = document.getElementById("readyBtn");
const wait_div = document.getElementById("waitDiv");
const example_div = document.getElementById("exampleDiv");
const input_div = document.getElementById("inputDiv");

ready_btn.addEventListener("click", async () => {
    ready_btn.style.display = "none";
    wait_div.style.display = "block";
    await fetchExampleText();
    
    wait_div.textContent = "3";

    setTimeout(() => {
        wait_div.textContent = "2";
    }, 1000)
    setTimeout(() => {
        wait_div.textContent = "1";
    }, 2000);
    setTimeout(() => {
        wait_div.textContent = "0";
    }, 3000);
    setTimeout(() => {
        wait_div.style.display = "none";
        example_div.style.visibility = "visible";
    }, 4000);
    await loadNextExampleText();
});

let is_composing = false; // IME入力が確定されていないかどうかを示すフラグ
// 変換セッションを開始
input_div.addEventListener('compositionstart', () => {
    is_composing = true;
});

// 変換セッションを終了
input_div.addEventListener('compositionend', () => {
    is_composing = false;
    assessTypingProgress();
});

let exampleText = "";

input_div.addEventListener("input", assessTypingProgress);
function assessTypingProgress() {
    if (is_composing) return; // IME入力が確定されていないときは処理を中断

    let i = 0;
    for (; i < input_div.value.length; i++) {
        if (input_div.value[i] == exampleText[i]) {
            continue;
        } else {
            break;
        }
    }
    if (i == exampleText.length) {
        loadNextExampleText();
    } else {
        example_div.children[0].textContent = exampleText.slice(0, i);
        example_div.children[1].textContent = exampleText.slice(i, exampleText.length);
    }
};


let example_queue = new Queue();

// 次の例文を表示
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

async function fetchExampleText() {
    await fetch(`/application/generate?count=${STOCK_NUM}`)
        .then(response => response.text())
        .then(data => {
            let result = data;
            let text_arr = result.split('\n');
            for (let i = 0; i < text_arr.length; i++) {
                example_queue.push(text_arr[i]);
            }
        })
        .catch(error => {
            console.error('Error during Fetching:', error);
        });
};