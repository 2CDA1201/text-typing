/**
 * キューを実装するクラス
 */
class Queue {
    constructor() {
        this.queue = [];
    }

    push(element) {
        this.queue.push(element);
    }

    pop() {
        if (this.queue.length === 0) {
            return null;
        }
        return this.queue.shift();
    }
}

const STOCK_NUM = 5;
let example_queue = [];
let exampleText = "";
const ready_btn = document.getElementById("readyBtn");
const wait_div = document.getElementById("waitDiv");
const example_div = document.getElementById("exampleDiv");
const input_div = document.getElementById("inputDiv");

ready_btn.addEventListener("click", async () => {
    ready_btn.style.display = "none";
    wait_div.style.display = "block";
    await getExampleText();
    
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
        input_div.style.visibility = "visible";
        example_div.style.visibility = "visible";
    }, 4000);
    await nextExample();
});

let is_composing = false; // IME入力が確定されていないかどうかを示すフラグ
// 変換セッションを開始
input_div.addEventListener('compositionstart', () => {
    is_composing = true;
});

// 変換セッションを終了
input_div.addEventListener('compositionend', () => {
    is_composing = false;
    evaluateInputText();
});


input_div.addEventListener("input", evaluateInputText);
function evaluateInputText() {
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
        nextExample();
    } else {
        example_div.children[0].textContent = exampleText.slice(0, i);
        example_div.children[1].textContent = exampleText.slice(i, exampleText.length);
    }
};

async function nextExample() {
    do {
        // console.log(example_queue);
        exampleText = example_queue.pop();
    } while (exampleText === "");
    input_div.value = "";
    example_div.children[0].textContent = "";
    example_div.children[1].textContent = exampleText;

    if (example_queue.length < STOCK_NUM) {
        getExampleText();
    }
}


async function getExampleText() {
    await fetch(`/application/generate?count=${STOCK_NUM}`)
        .then(response => response.text())
        .then(data => {
            let result = data;
            let text_arr = result.split('\n');
            for (let i = 0; i < text_arr.length; i++) {
                example_queue.unshift(text_arr[i]);
            }
        })
        .catch(error => {
            console.error('Error during Fetching:', error);
        });
};