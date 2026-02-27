const express = require('express');
const path = require('node:path');
const { insertArticle, getArticles, insertComment, openArticle } = require('./funcs/articles');
const { MongoClient, ObjectId } = require('mongodb');


const client = new MongoClient('mongodb://localhost:27017');

const app = express();

app.set('view engine', 'ejs');

app.use('/static', express.static(path.join(__dirname, 'public')));

async function main() {
    await client.connect();

    const db = client.db('my-app');

    app.get('/', async (req, res) => {
        const { articles } = await getArticles(db);
        res.render(path.resolve(__dirname, 'views/index.ejs'), { articles: articles });
    });

    app.get('/article/:id', async (req, res) => {
        const id = req.params.id;
        const { status, body } = await openArticle(id, db);
        if (status !== 200) {
            return res.status(status).send(body);
        }
        res.render(path.resolve(__dirname, 'views/detail.ejs'), { article: body });
    });

    app.post('/api/article', express.json(), async (req, res) => {
        const title = req.body.title;
        const content = req.body.content;
        const { status, body } = await insertArticle({ title, content }, db);
        res.status(status).send(body);
    });

    app.post('/api/comment', express.json(), async (req, res) => {
        const articleId = req.body.articleId;
        const comment = req.body.comment;
        const { status, body } = await insertComment({ articleId, comment }, db);
        res.status(status).send(body);
    })

    app.listen(3000, () => {
        console.log('start listening');
    });
}
main();