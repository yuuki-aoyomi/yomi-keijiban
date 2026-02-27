// public/index.js
// クリックでユーザー名をアラート表示
window.addEventListener('DOMContentLoaded', (event) => {
  document.querySelectorAll('.article-name').forEach((elem) => {
    elem.addEventListener('click', (event) => {
      alert(event.target.innerHTML);
    });
  });
});

// 送信でinputをDBに登録
window.addEventListener('DOMContentLoaded', (event) => {
  document.querySelector('.send-button').addEventListener('click',(event) => {
    const inputValue = document.querySelector('.input-text').value;
    fetch('/api/article', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: inputValue }) })
  });
});