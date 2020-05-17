const request = require("request");
const cheerio = require("cheerio");
const db = require('../.././db');

// viewrequest
requestPostViewXep=(url, id)=>{
	request({url}, (err,
		res, html) =>{
		if(!err && res.statusCode == 200){
			const $ = cheerio.load(html)
			db.get('viewsXepHang').remove().write()

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

			
				db.get('viewsXepHang')
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


				db.get('viewsXepHang')
				  .push({ 
				  	_id : chapter.slice(8,11),
				  	chapter : chapter,
				  	chapterHref : chapterHref
				  })
				  .write()
			})

			}

	})
}




 module.exports = requestPostViewXep;