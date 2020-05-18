
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
    console.log(newUser)

})

app.get('/search/zon/:id', function(req, res){

    Post.findById(req.params.id)
        .then(posts => {
            console.log(posts.linkHome)
            requestsPostView(posts.linkHome,req.params.id)

            var viewsItems = db.get('views').value()

            res.render('pageViewSearch/viewPageSearch',{
                viewsItems:viewsItems,
                id:req.params.id,
                url:posts.linkHome
            })
        })
        .catch(err => res.status(400).json('Err :' + err))
})


app.get('/', (req, res)=>{

	requestsHome;
	requestsXephang;
	requestsConGai;
    
    res.render('pageHome/homePage',{
    	db:db.get('posts').value(),
    	homeXephang:db.get('homeXephang').value(),
    	homeConGai:db.get('homeConGai').value()
    })

})







app.get('/post/:id', function(req, res){
    const id = req.params.id
    const items = db.get('posts').find({ id: parseInt(id) }).value()
    const url = items.linkHome

    

    requestsPostView(url,id)
    var viewsItems = db.get('views').value()

    // req.session.temiew = [
    //     {
    //         url: url,
    //         img: viewsItems[0].imgView,
    //         like: '4550'
    //     }
    // ]
    
    res.render('pageView/viewPage',{
    	viewsItems:viewsItems,
    	id:id,
    	_id:items.id,
        url:url
	})
    
})



app.get('/post/xephang/:id', function(req, res){
    const id = req.params.id
    const items = db.get('homeXephang').find({ id: parseInt(id) }).value()
    const url = items.linkHome
    const viewsXepHang = db.get('viewsXepHang').value()


    requestPostViewXep(url,id)
    
    res.render('pageViewXepHang/ViewXepHangPage',{
    	viewsXepHang:viewsXepHang,
    	id:id,
    	_id:items.id
    })
    
})

app.get('/post/congai/:id', function(req, res){
    
    const id = req.params.id
    const items = db.get('homeConGai').find({ id: parseInt(id) }).value()
    const url = items.linkHome
    const viewsConGai = db.get('viewsConGai').value()


    requestViewConGai(url,id)

    res.render('pageViewConGai/ViewConGaiPage',{
    	viewsConGai:viewsConGai,
    	id:id,
    	_id:items.id
    })
    
})




app.get('/post/chapcongai/:id', function(req, res){
    const _id = req.params.id
    const items = db.get('viewsConGai').find({ _id: _id }).value()
    const url = items.chapterHref

    
    var chapsConGai = db.get('chapsConGai').value()
    requestChapConGai(url, _id);

    res.render('pageViewChapConGai/ViewChapConGaiPage',{
    	chapsConGai:chapsConGai,
    	_id : _id
    })
    
})




app.get('/post/chapxephang/:id', function(req, res){
    const _id = req.params.id
    const items = db.get('viewsXepHang').find({ _id: _id }).value()
    const url = items.chapterHref

    var chapsXephangItems = db.get('chapsXephang').value()

    requestsChapXepHang(url, _id);
    
    res.render('pageViewChapXephang/ViewChapXephangPage',{
    	chapsXephangItems:chapsXephangItems,
    	_id : _id
    })
    
})



app.get('/post/chap/:id', function(req, res){
    const _id = req.params.id
    const items = db.get('views').find({ _id: _id }).value()
    const url = items.chapterHref

    var chapsItems = db.get('chaps').value()

    resquestsChapPost(url, _id)
    

    res.render('pageViewChap/viewPageChap',{
    	chapsItems:chapsItems,
    	_id : _id
    })
    
})

app.get('/post', function(req, res){
	requestsHome();

    res.render('pagePost/PostPage',{
    	db:db.get('posts').value()
    })
    
})

app.get('/bangxephang', function(req, res){
	requestsXephang();

    res.render('pageXepHang/XepHangPage',{
    	homeXephang:db.get('homeXephang').value()
    })
    
})

app.get('/congai', function(req, res){
	requestsConGai();

    res.render('pageConGai/ConGaiPage',{
    	homeConGai:db.get('homeConGai').value()
    })
    
})


//saerch



// app.get('/search', function(req, res){

//  // for (let i = 1; i < 9; i++) {
//  request(`http://truyenqq.com/top-thang/trang-3.html`, (err,
//      res, html) =>{
//      if(!err && res.statusCode == 200){
//          const $ = cheerio.load(html)
//          // db.get('homeConGai').remove().write()

//          $('.list-stories li .story-item').each((i, el)=>{
//              const imageHome = $(el)
//                  .find('a img')
//                  .attr('data-src')

//              const nameHome = $(el)
//                  .find('h3 a')
//                  .text()

//              const linkHome = $(el)
//                  .find('a')
//                  .attr('href')

//              const status = "true"
//              const newUser = new Post({imageHome,nameHome,linkHome,status})
//              console.log(newUser)
//              newUser.save()
                
//          })

//      }
//  })
// // }

//     // res.render('pageSearch/SearchPage')
    
// })

// app.get('/reset', function(req, res){
//  Post.find()
//         .then(posts => {
//          console.log(posts.status)

//         })
//         .catch(err => res.status(400).json('Err :' + err))
//  // res.json('reset oke')
// })

// app.get('/addTemview', function(req, res){
//     // const items = db.get('posts').find({ id: parseInt(id) }).value()
//     // const url = items.linkHome
//     // req.session = "ghg"
//     console.log(req.session.temiew)

// })





app.listen(port, function(){
    console.log("hey,babe tuan" + port)
});