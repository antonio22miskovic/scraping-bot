const {jsonReader, jsonWrite, clearString} = require('../src/helpers.js')
const {getMessage} = require('../src/discord.js')
const cheerio = require('cheerio')
const request = require('request-promise')

class StockScraping { // este objeto se encargara de administrar el stock de la pagina
	// calculando cuando no alla stock disponible en la pagina

	constructor(){ // constructor

		this.url = null
		this.data_validation = null
		this.url_json = null
		this.products = []

	}

	async urlStock (url) {

		var elements = []
		this.url = url
		if (await  this.url === 'https://www.taf.com.mx/') {
			this.data_validation = await require('../src/data/stock/taf.json')
			this.url_json = './src/data/taf.json'
		}else{
			let array = await this.url.trim().split('/')
			console.log(array[4])
			if (array[4] !== undefined) {
				this.data_validation = await require(`../src/data/stock/${array[3]}_${array[4]}.json`)
				this.url_json = `./src/data/stock/${array[3]}_${array[4]}.json`
			}else{
				this.data_validation = await require(`../src/data/stock/${array[3]}.json`)
				this.url_json = `./src/data/stock/${array[3]}.json`
			}
		}

		// console.log('dentro del scraping')
		// let $ = await request({
		// 	url: this.url,
		// 	transform: body => cheerio.load(body)
		// })
		// console.log('se esta realizando el stock  del el scraping de:', this.url)
		// await $('.product-item__wrapper').each( (i, item) => { // ajuntar los elementos en un array
		// 	elements.push(item)
		// })

		// for await(let item of  elements) {

		// 	if ( await  //  filtro
		// 		// nuevo o lanzamiento
		// 			// (
		// 			// 	clearString($(item).find('p').text()) === "RestringidoEncuesta"||
		// 			// 	clearString($(item).find('p').text()) === "Lanzamientos"
		// 			// ) &&
		// 			clearString($(item).find('.product-item__category').text()) === 'Sneakers' &&
		// 		  clearString($(item).find('.product-item__brand-name').text()) === 'Nike'
		// 		)
		// 	{

		// 		let data = await {
		// 			title: clearString($(item).find('p').text()) === 'Lanzamientos' ? 'Nuevo Lanzamiento' : 'Nuevo Producto',
		// 	  	categoria: clearString($(item).find('.product-item__category').text()),
		// 	  	name: clearString($(item).find('.product-item__name').text()),
		// 	  	marca: clearString($(item).find('.product-item__brand-name').text()),
		// 	  	departamento: clearString($(item).find('.product-item__department').text()),
		// 	  	price: clearString($(item).find('.product-item__price').text()),
		// 	  	url: $(item).find('.product-item__main-image').attr('href'),
		// 	  	img: $(item).find('.product-item__main-image').children('img').attr('src')
		// 		}
 	// 			await this.products.push(data)
		// 	}
		// }

		await	this.stock(' https://www.taf.com.mx/nike-air-max-infinity-bq3999-003/p')
		// for await (let item of this.products) {

		// 	await	this.stock(item.url)


		// }

	}

	async stock (url) {


		console.log('analizando el stock del producto:',url)
		let $ = await request({
			url: url,
			headers: {
        'User-Agent': '	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
   		},
			transform: body => cheerio.load(body)
		})
		// let element = $('.product-detail__wrapper > div > .product-detail > div').eq(2)
		 let element = $('.product-detail__wrapper > div > .product-detail > div').eq(2)
		let element_2 = $(element).find('.product-detail__sku-selection > li')
		console.log('el valor',$(element_2).html())

	}



}

module.exports = StockScraping