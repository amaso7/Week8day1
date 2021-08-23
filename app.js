require('dotenv').config
const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const PORT = 3000
const path = require('path')
const VIEWS_PATH = path.join(__dirname, 'views')

const pgp = require('pg-promise')()
const connectionString = 'postgres://localhost:5432/blog'
const db = pgp(connectionString)

app.use(express.urlencoded())

app.engine('mustache', mustacheExpress(VIEWS_PATH +'/partials', '.mustache'))
app.set('views', VIEWS_PATH)
app.set('view engine', 'mustache')

app.get('/blog', (req, res)=>{
    let posts = db.any('SELECT postid, title, author, dateposted, dateupdated, posttext FROM posts ORDER BY dateposted DESC')
    res.render('blog', {posts:posts})
})
app.get('/blog/addblog', (req, res)=>{
    res.render('addBlog')
})
app.post('/blog/addblog', (req, res)=>{
    let postTitle = req.body.postTitle
    let postAuthor = req.body.postAuthor
    let postText = req.body.postText
    let updatePost = db.none('INSERT INTO posts(title, author, posttext) VALUES($1, $2, $3)',[postTitle, postAuthor, postText])
    res.redirect('/blog')
})
app.get('/blog/:id/updateblog',(req, res) => {
    let postId = req.params.postId
    let posts = db.any('SELECT postid, title, author, dateposted, datelastupdated, posttext FROM posts WHERE postid = $1', [postId])
    res.render('updateBlog', {posts: posts})
})

app.post('/blog/:id/updateblog/update', (req, res) =>{
    let postID = req.params.id
    let postTitle = req.body.postTitle
    let postAuthor = req.body.postAuthor
    let postText = req.body.postText
    let posts = db.none('UPDATE INTO posts SET title = $1, author = $2, , posttext = $3 WHERE postid = $4',[postTitle, postAuthor, postText, postId])
})
app.post('/blog/:id/deleteblog', (req, res) =>{
    let postId = req.params.id
    let deletepost = db.none('DELETE FROM posts WHERE postid = $1', [postId])
    res.redirect('/blog')
})
app.listen(PORT, ()=>{
    console.log('server has started...')
})
