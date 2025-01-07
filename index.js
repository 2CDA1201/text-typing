require('dotenv').config();

document.getElementById('fetchDataBtn').addEventListener('click', async () => {
    const resultDiv1 = document.getElementById('title');
    const resultDiv2 = document.getElementById('body');
    resultDiv1.textContent = 'データ取得中';
    resultDiv2.textContent = '';
    
    console.log(process.env.API_KEY);
    
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        const data = await response.json();
        resultDiv1.textContent = `タイトル: ${data.title}`;
        resultDiv2.textContent = `本文: ${data.body}`;
    } catch (error) {
        resultDiv1.textContent = 'データの取得に失敗しました。';
    }
});