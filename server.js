
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const request = require("request");
const cheerio = require("cheerio");
const mongoose = require('mongoose');
const Post = require('./models/post.models');
var session = require('express-session');
const bodyParser = require('body-parser');


app.use(bodyParser.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

const requestsHome = require('./requests/requestsHome');
const requestsXephang = require('./requests/requestsXephang');
const requestsConGai = require('./requests/requestsConGai');

//requests view
const requestsPostView = require('./requests/requestsView/requestsPostView');
const requestPostViewXep = require('./requests/requestsView/requestPostViewXep');
const requestViewConGai = require('./requests/requestsView/requestViewConGai');

//requests Chap
const requestChapConGai = require('./requests/requestsChap/requestChapConGai');
const requestsChapXepHang = require('./requests/requestsChap/requestsChapXepHang');
const resquestsChapPost = require('./requests/requestsChap/resquestsChapPost');

const db = require('./db');

mongoose.connect(
  "mongodb+srv://enniszeu:01695419337@cluster0-okm7c.azure.mongodb.net/test?retryWrites=true&w=majority",
  { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
);

app.use(express.static('public'));

app.set('view engine', 'pug');
app.set('views', './views');


app.get('/search', (req, res)=>{
    Post.find()
    .then(posts => {
        var q = req.query.q;
        var matching = posts.filter(function(post){
            return post.nameHome.toLowerCase().indexOf(q) !== -1;
        })
        res.render('pageSearch/SearchPage', {posts : matching})
    })
    .catch(err => res.status(400).json("Err :" + err));
})

app.get('/addBook', (req, res)=>{
    res.render("addBook/addBook")

})



app.post('/addBook', (req, res, next)=>{
    
    const imageHome = req.body.imageHome;
    const nameHome = req.body.nameHome;
    const linkHome = req.body.linkHome;


    const newUser = new Post({imageHome,nameHome,linkHome})
    newUser.save()
        .then(() => res.json('User add'))
        .catch(err => res.status(400).json('Err: ' + err));
})



app.get('/search/zon/:id', (req, res, next)=> {

    Post.findById(req.params.id)
        .then(posts => {
            requestsPostView(posts.linkHome,req.params.id)
            next()
        })
        .catch(err => res.status(400).json('Err :' + err))
}, (req, res, next)=> {
    var viewsItems = db.get('views').value()

    res.render('pageViewSearch/viewPageSearch',{
        viewsItems:viewsItems,
        id:viewsItems[0].id
    })
})



app.get('/',requestsHome,requestsXephang,requestsConGai, (req, res, next)=>{

    setTimeout(function(){ 
        res.render('pageHome/homePage',{
            db:db.get('posts').value(),
            homeXephang:db.get('homeXephang').value(),
            homeConGai:db.get('homeConGai').value()
        })
    }, 2000);
})







app.get('/post/:id', function(req, res, next){
    const id = req.params.id
    const items = db.get('posts').find({ id: parseInt(id) }).value()
    const url = items.linkHome

    requestsPostView(url,id)
    next()
    
}, (req, res, next)=> {
    
    var viewsItems = db.get('views').value()

    setTimeout(function(){ 
        res.render('pageView/viewPage',{
            viewsItems:viewsItems,
            id: viewsItems[0].id
        })
    }, 2000);


})



app.get('/post/xephang/:id', function(req, res, next){
    const id = req.params.id
    const items = db.get('homeXephang').find({ id: parseInt(id) }).value()
    const url = items.linkHome

    requestPostViewXep(url,id)
    next()
}, (req, res, next)=> {
    
    const viewsXepHang = db.get('viewsXepHang').value()

    setTimeout(function(){ 
        res.render('pageViewXepHang/ViewXepHangPage',{
            viewsXepHang:viewsXepHang,
            id:viewsXepHang[0].id
        })
    }, 2000);

})

app.get('/post/congai/:id', function(req, res, next){
    
    const id = req.params.id
    const items = db.get('homeConGai').find({ id: parseInt(id) }).value()
    const url = items.linkHome

    requestViewConGai(url,id)
    next()
}, (req, res, next)=> {
    
    const viewsConGai = db.get('viewsConGai').value()

    setTimeout(function(){ 
        res.render('pageViewConGai/ViewConGaiPage',{
            viewsConGai:viewsConGai,
            id:viewsConGai[0].id
        })
    }, 2000);

})




app.get('/post/chapcongai/:id', function(req, res){
    const _id = req.params.id
    const items = db.get('viewsConGai').find({ _id: _id }).value()
    const url = items.chapterHref

    requestChapConGai(url, _id);

    var chapsConGai = db.get('chapsConGai').value()

    
    setTimeout(function(){ 
        res.render('pageViewChapConGai/ViewChapConGaiPage',{
            chapsConGai:chapsConGai,
            _id : _id
        })
    }, 2000);  
    
})




app.get('/post/chapxephang/:id', function(req, res){
    const _id = req.params.id
    const items = db.get('viewsXepHang').find({ _id: _id }).value()
    const url = items.chapterHref

    requestsChapXepHang(url, _id);
    
    var chapsXephangItems = db.get('chapsXephang').value()
    
    setTimeout(function(){ 
        res.render('pageViewChapXephang/ViewChapXephangPage',{
            chapsXephangItems:chapsXephangItems,
            _id : _id
        })
    }, 2000);   
    
})



app.get('/post/chap/:id', function(req, res){
    const _id = req.params.id
    const items = db.get('views').find({ _id: _id }).value()
    const url = items.chapterHref

    resquestsChapPost(url, _id)

    var chapsItems = db.get('chaps').value()
    
    setTimeout(function(){ 
        res.render('pageViewChap/viewPageChap',{
            chapsItems:chapsItems,
            _id : _id
        }) 
    }, 2000);   
})

app.get('/post',requestsHome, function(req, res){

    setTimeout(function(){ 
        res.render('pagePost/PostPage',{
            db:db.get('posts').value()
        })
    }, 2000);
})


app.get('/bangxephang',requestsXephang, function(req, res, next){
    setTimeout(function(){
        res.render('pageXepHang/XepHangPage',{
            homeXephang:db.get('homeXephang').value()
        })
    }, 2000);
})


app.get('/congai',requestsConGai, function(req, res, next){

    setTimeout(function(){
        res.render('pageConGai/ConGaiPage',{
            homeConGai:db.get('homeConGai').value()
        })
    }, 2000);
    
})

app.listen(port, function(){
    console.log("hey,babe tuan" + port)
});