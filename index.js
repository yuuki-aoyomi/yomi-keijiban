const express = require('express');
const path = require('node:path');
const { insertArticle, getArticles } = require('./funcs/articles');
const { MongoClient } = require('mongodb');


const client = new MongoClient('mongodb://localhost:27017');

const app = express();

app.set('view engine', 'ejs');

app.use('/static', express.static(path.join(__dirname, 'public')));

async function main() {
    await client.connect();

    const db = client.db('my-app');

    app.get('/', async (req, res) => {
        const { article_names } = await getArticles(db);
        res.render(path.resolve(__dirname, 'views/index.ejs'), { articles: article_names });
    });

    app.post('/api/article', express.json(), async (req, res) => {
        const article_name = req.body.name;
        const { status, body } = await insertArticle(article_name, db);
        res.status(status).send(body);
    });

    app.listen(3000, () => {
        console.log('start listening');
    });
}
main();