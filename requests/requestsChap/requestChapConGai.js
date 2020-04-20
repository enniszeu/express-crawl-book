const request = require("request");
const cheerio = require("cheerio");
const db = require('../.././db');

function requestChapConGai(url, _id){
	request({url}, (err,
		res, html) =>{
		if(!err && res.statusCode == 200){
			const $ = cheerio.load(html)
			db.get('chapsConGai').remove().write()

			$('.reading-detail div').each((i, el)=>{
				const imageChap = $(el)
					.find('img')
					.attr('src')

				const nameChap = $(el)
					.find('img')
					.attr('src')

				db.get('chapsConGai')
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

			db.get('chapsConGai')
				  .push({ 
				  	nameChap : nameChap,
				  	dateChap : dateChap
				  })
				  .write()

		}
	})
}


 module.exports = requestChapConGai;