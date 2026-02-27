# yomi-keijiban

簡易掲示板アプリです。ユーザー登録なしで記事を作成・コメント投稿できます。

## 機能
- 記事作成
- 記事一覧表示
- 記事詳細表示
- コメント投稿（削除機能なし）

## 環境構築・インストール・起動方法

### 前提条件
- Node.js 20+
- npm
- MongoDB（ローカルまたは Docker）

### プロジェクトのインストール・起動手順
下記を **そのままターミナルで順番にコピペ** してください。

```bash
# リポジトリをクローン
git clone https://github.com/yuuki-aoyomi/yomi-keijiban.git
cd yomi-keijiban

# 依存パッケージをインストール
npm install

# MongoDB を Docker で起動
docker run -d -p 27017:27017 --name mongo mongo:latest

# アプリを起動
node index.js

# ブラウザで確認
# http://localhost:3000
```

### 使用方法
## 記事の作成
アクセス後 title 欄に記事のタイトルを、content に内容を記入し「送信」ボタンを押す。
作成に成功すると一覧にタイトルが表示される。(記事は上から作成日時順に並んでいる)

## 記事へのアクセス
タイトルをクリックすることでその記事のページに飛ぶことができる。

## 記事へのコメント
記事のページ内の new comment 欄に記入して「送信」ボタンを押すことでコメントを送信することができる。
新規コメントほど下に表示される。

### MongoDB のシェル操作
# Docker コンテナに接続
docker exec -it mongo mongosh

# データベースを選択
use my-app

# 記事一覧を確認
db.article.find().pretty()

# 記事削除（任意）
db.article.deleteOne({ _id: ObjectId("<記事ID>") })

