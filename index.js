document.getElementById('fetchDataBtn').addEventListener('click', async function () {
    const resultDiv1 = document.getElementById('title');
    resultDiv1.textContent = 'データ取得中';

    await fetch('/application/generate?count=1')
        .then(response => response.text())
        .then(data => {
            resultDiv1.textContent = data;
        })
        .catch(error => {
            console.error('Error during Fetching:', error);
            resultDiv1.textContent = 'エラーが発生しました';
        });
});