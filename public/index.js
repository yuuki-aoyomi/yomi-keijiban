// 送信でinputをDBに登録
window.addEventListener('DOMContentLoaded', (event) => {
    document.querySelector('.send-button').addEventListener('click', async (event) => {
        const titleValue = document.querySelector('.input-title').value;
        const contentValue = document.querySelector('.input-content').value;
        const res = await fetch('/api/article', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: titleValue, content: contentValue }) });
        if (res.ok) {
            location.reload();
        } else {
            console.error('failed to create new article');
        }
    });
});