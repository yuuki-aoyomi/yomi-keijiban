const { test } = require('node:test');
const assert = require('node:assert');

const { insertArticle } = require('./articles');
const { Collection } = require('mongodb');

test('insertArticle', async (t) => {
    const insertOne = t.mock.fn();
    const db = {
        collection: () => {
            return { insertOne };
        }
    };
    // テスト用データ
    const article = { title: 'テスト記事', content: '内容テスト' };

    // 実行
    const { status, body } = await insertArticle(article, db);

    // 確認
    assert.strictEqual(status, 200, 'ステータスは200');
    assert.strictEqual(body, 'created', '本文はcreated');
    assert.strictEqual(insertOne.mock.callCount(), 1, '一度だけinsertOneが呼ばれる')
})

// test('insertArticle: db error', async(t)=>{
    
// })