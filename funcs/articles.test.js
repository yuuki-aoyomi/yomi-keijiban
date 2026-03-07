const { test } = require('node:test');
const assert = require('node:assert');

const { insertArticle, insertComment, getArticles, openArticle } = require('./articles');

test('insertArticle:success', async (t) => {
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

    // DBに渡されたデータ確認
    const arg = insertOne.mock.calls[0].arguments[0];

    assert.strictEqual(arg.title, 'テスト記事');
    assert.strictEqual(arg.content, '内容テスト');
    assert.ok(arg.date instanceof Date);
    assert.deepStrictEqual(arg.comments, []);
})

test('insertArticle: no title', async () => {
    const db = { collection: () => ({ insertOne: () => { } }) };

    const { status, body } = await insertArticle({ content: 'test' }, db);

    assert.strictEqual(status, 400);
    assert.strictEqual(body, 'bad request');
});

test('insertArticle: title too long', async () => {
    const db = { collection: () => ({ insertOne: () => { } }) };

    const article = {
        title: 'a'.repeat(101),
        content: 'test'
    };

    const { status, body } = await insertArticle(article, db);

    assert.strictEqual(status, 400);
    assert.strictEqual(body, 'too long title');
});

test('insertArticle: db error', async (t) => {
    const insertOne = t.mock.fn(() => {
        throw new Error('db error');
    });

    const db = {
        collection: () => ({ insertOne })
    };

    await assert.rejects(async () => {
        await insertArticle({ title: 'a', content: 'b' }, db);
    });
});

test('insertComment: success', async (t) => {
    const updateOne = t.mock.fn(() => ({ matchedCount: 1 }));
    const db = {
        collection: () => {
            return { updateOne };
        }
    };

    const data = {
        articleId: '507f1f77bcf86cd799439011',
        comment: 'test comment'
    };

    const { status, body } = await insertComment(data, db);
    assert.strictEqual(status, 200);
    assert.strictEqual(body, 'created');
    assert.strictEqual(updateOne.mock.callCount(), 1);
});

test('insertComment: article not found', async (t) => {
    const updateOne = t.mock.fn(() => ({ matchedCount: 0 }));
    const db = {
        collection: () => {
            return { updateOne };
        }
    };

    const data = {
        articleId: '507f1f77bcf86cd799439011',
        comment: 'test comment'
    };

    const { status, body } = await insertComment(data, db);
    assert.strictEqual(status, 404);
    assert.strictEqual(body, 'not found');
});

test('getArticles', async () => {
    const articlesMock = [
        { title: 'article1', content: 'content1' },
        { title: 'article2', content: 'content2' }
    ];

    const db = {
        collection: () => ({
            find: () => ({
                toArray: async () => articlesMock
            })
        })
    };

    const result = await getArticles(db);

    assert.deepStrictEqual(result.articles, articlesMock);
});

test('openArticle: success', async () => {
    const articleMock = {
        title: 'test title', content: 'test content'
    };

    const db = {
        collection: () => ({
            findOne: async () => articleMock
        })
    };

    const result = await openArticle('507f1f77bcf86cd799439011', db);

    assert.strictEqual(result.status, 200);
    assert.deepStrictEqual(result.body, articleMock);
});

test('openArticle: not found', async () => {
    const db = {
        collection: () => ({
            findOne: async () => null
        })
    };

    const result = await openArticle('507f1f77bcf86cd799439011', db);

    assert.strictEqual(result.status, 404);
    assert.strictEqual(result.body, 'not found');
});