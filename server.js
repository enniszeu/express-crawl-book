
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const request = require("request");
const cheerio = require("cheerio");
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const bodyParser = require('body-parser');
 
const adapter = new FileSync('db.json')
const db = low(adapter)

app.use(express.static('public'));

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.set('view engine', 'pug');
app.set('views', './views');

// const db = []

db.defaults({ posts: [], views: [], chaps: [] })
  .write()







app.get('/', (req, res)=>{
	request('http://www.nettruyen.com/', (err,
	res, html) =>{
	if(!err && res.statusCode == 200){
		const $ = cheerio.load(html)
		db.get('posts').remove().write()

		$('figure').each((i, el)=>{
			const imageHome = $(el)
				.find('.image a img')
				.attr('data-original')

			const nameHome = $(el)
				.find('.image a img')
				.attr('alt')

			const linkHome = $(el)
				.find('.image a')
				.attr('href')

			const chapHome = $(el)
				.find('figcaption ul li a')
				.attr('title')

			const chapTime = $(el)
				.find('figcaption ul li i')
				.text()
			
			db.get('posts')
			  .push({ 
			  	id : i+1,
				imageHome : imageHome,
				nameHome : nameHome.slice(13,500),
				linkHome : linkHome,
				chapHome : chapHome,
				chapTime : chapTime.slice(0,11)
			  })
			  .write()

			// db.set({
			// 	'posts.id' : i,
			// 	'posts.imageHome' : imageHome,
			// 	'posts.nameHome' : nameHome,
			// 	'posts.linkHome' : linkHome,
			// 	})
			//   .write()
		})

	}
})
    res.render('pageHome/homePage',{
    	db:db.get('posts').value()
    })

})


// viewrequest
function requestss(url, id){
	request({url}, (err,
		res, html) =>{
		if(!err && res.statusCode == 200){
			const $ = cheerio.load(html)
			db.get('views').remove().write()

			const nameView = $('.col-image')
				.find('img')
				.attr('alt')

			const imgView = $('.col-image')
				.find('img')
				.attr('src')

			const dataView = $('#item-detail')
			.find('.small')
			.text()
			.slice(0,47)
		
			const tenKhac = $('.list-info .othername')
				.find('h2')
				.text()	

			const tacGia = $('.list-info .author')
				.find('.col-xs-8')
				.text()	

			const tinhTrang = $('.list-info .status')
				.find('.col-xs-8')
				.text()	

			const theLoai = $('.list-info .kind')
				.find('.col-xs-8')
				.text()	

			const noiDung = $('.detail-content')
				.find('p')
				.text()	

			
				db.get('views')
				  .push({ 
				  	id:id,
				  	nameView : nameView,
					imgView : imgView,
					dataView : dataView,
					tenKhac : tenKhac,
					tacGia : tacGia,
					tinhTrang : tinhTrang,
					theLoai : theLoai,
					noiDung : noiDung
				  })
				  .write()

				  $('ul li .chapter').each((i, el)=>{
				const chapter = $(el)
					.find('a')
					.text()
					.replace(":", "")

				const chapterHref = $(el)
					.find('a')
					.attr('href')


				db.get('views')
				  .push({ 
				  	_id : chapter.slice(8,10),
				  	chapter : chapter,
				  	chapterHref : chapterHref
				  })
				  .write()
			})

			}

	})
}


app.get('/post/:id', function(req, res){
    const id = req.params.id
    const items = db.get('posts').find({ id: parseInt(id) }).value()
    const url = items.linkHome



    requestss(url,id)
    var viewsItems = db.get('views').value()
    
    res.render('pageView/viewPage',{
    	viewsItems:viewsItems,
    	id:id,
    	_id:items.id
	})
    
})

app.get('/post/chap/:id', function(req, res){
    const _id = req.params.id
    const items = db.get('views').find({ _id: _id }).value()
    const url = items.chapterHref

    
    var chapsItems = db.get('chaps').value()
    var ab = db.get('views').value()


    console.log(ab)
    console.log(_id)

    request({url}, (err,
		res, html) =>{
		if(!err && res.statusCode == 200){
			const $ = cheerio.load(html)
			db.get('chaps').remove().write()

			$('.reading-detail div').each((i, el)=>{
				const imageChap = $(el)
					.find('img')
					.attr('src')

				const nameChap = $(el)
					.find('img')
					.attr('src')

				db.get('chaps')
				  .push({ 
				  	imageChap : imageChap
				  })
				  .write()
				
			})

			const nameChap = $('.top')
				.find('h1')
				.text()

			const dateChap = $('.top')
				.find('i')
				.text()

			db.get('chaps')
				  .push({ 
				  	nameChap : nameChap,
				  	dateChap : dateChap
				  })
				  .write()
			
			// console.log(nameChap)
			// console.log(dateChap)

		}
	})

    // console.log(chapsItems)
    res.render('pageViewChap/viewPageChap',{
    	chapsItems:chapsItems,
    	_id : _id
    })
    
})



app.listen(port, function(){
    console.log("hey,babe tuan" + port)
});