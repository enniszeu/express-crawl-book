const request = require("request");
const cheerio = require("cheerio");
const db = require('.././db');

requestsXephang=(req, res, next)=>{
	request('http://www.nettruyen.com/tim-truyen?status=-1&sort=12', (err,
		res, html) =>{
		if(!err && res.statusCode == 200){
			const $ = cheerio.load(html)
			db.get('homeXephang').remove().write()

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
				

				db.get('homeXephang')
				  .push({ 
				  	id : i+1,
					imageHome : imageHome,
					nameHome : nameHome.slice(13,500),
					linkHome : linkHome,
					chapHome : chapHome,
					chapTime : chapTime.slice(0,11)
				  })
				  .write()
			})

		}
	})
	next()
}


 module.exports = requestsXephang;