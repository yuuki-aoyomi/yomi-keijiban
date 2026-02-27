const { ObjectId } = require("mongodb");

async function insertArticle({ title, content }, db) {
    if (!title || !content) {
        return { status: 400, body: 'bad request' };
    }
    if (typeof title != 'string' || typeof content != 'string') {
        return { status: 400, body: 'not string' };
    }
    if (title.length > 100) {
        return { status: 400, body: 'too long title' };
    }
    if (content.length > 1000) {
        return { status: 400, body: 'too long content' };
    }
    await db.collection('article').insertOne({ title: title, content: content, date: new Date(), comments: [] });
    return { status: 200, body: 'created' };
}
exports.insertArticle = insertArticle;

async function insertComment({ articleId, comment }, db) {
    if (!articleId || !comment) {
        return { status: 400, body: 'bad request' };
    }
    try {
        var id = new ObjectId(articleId);
    } catch (err) {
        return { status: 400, body: 'bad request' };
    }
    if (typeof comment != 'string') {
        return { status: 400, body: 'not string' };
    }
    if (comment.length > 100) {
        return { status: 400, body: 'too long title' };
    }
    const result = await db.collection('article').updateOne({ _id: id }, { $push: { comments: comment } });
    if (result.matchedCount === 0) {
        return { status: 404, body: 'not found' };
    }
    return { status: 200, body: 'created' };
}
exports.insertComment = insertComment;

async function getArticles(db) {
    try {
        const articles = await db.collection('article').find().toArray()
        return { articles: articles };
    } catch (err) {
        return { articles: [] };
    }
}
exports.getArticles = getArticles;

async function openArticle(id, db) {
    try {
        const article = await db.collection('article')
            .findOne({ _id: new ObjectId(id) });

        if (!article) {
            return { status: 404, body: 'not found' };
        }
        return { status: 200, body: article };
    } catch (err) {
        return { status: 400, body: 'invalid id' };
    }
}
exports.openArticle = openArticle;