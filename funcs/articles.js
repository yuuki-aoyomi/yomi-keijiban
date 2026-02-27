async function insertArticle(name, db) {
    if (!name) {
        return { status: 400, body: 'bad request' };
    }
    if (typeof name != 'string') {
        return { status: 400, body: 'not string' };
    }
    if (name.length > 100) {
        return { status: 400, body: 'too long name' };
    }
    await db.collection('article').insertOne({ article_name: name });
    return { status: 200, body: 'created' };
}
exports.insertArticle = insertArticle;

async function getArticles(db) {
    try {
        const articles = await db.collection('article').find().toArray()
        const article_names = articles.map((article) => { return article.article_name });
        return { article_names: article_names };
    } catch (err) {
        return { article_names: [] };
    }
}
exports.getArticles = getArticles;