// public/detail.js
// 送信でinputをDBに登録
window.addEventListener('DOMContentLoaded', (event) => {
    document.querySelector('.send-button').addEventListener('click', async (event) => {
        const id = event.target.dataset.id;
        const commentValue = document.querySelector('.input-comment').value;
        const res = await fetch('/api/comment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ articleId: id, comment: commentValue }) })
        if (res.ok) {
            location.reload();
        }else{
            console.error('failed to post comment');
        }
    });
});