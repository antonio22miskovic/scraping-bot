const {jsonReader, jsonWrite} = require('../src/helpers.js')
const {getMessage} = require('../src/discord.js')
const cheerio = require('cheerio')
const request = require('request-promise')

class Scraping {

	constructor(){ // constructor

		this.url = null
		this.data_validation = null
		this.url_json = null
		this.product_new = []
		this.products = []

	}

	async scrapingPage (url) { // iniciador
		this.url = url
		if (await  this.url === 'https://www.taf.com.mx/') {
			this.data_validation = await require('../src/data/taf.json')
			this.url_json = './src/data/taf.json'
		}else{
			let array = await this.url.trim().split('/')
			this.data_validation = await require(`../src/data/${array[3]}.json`)
			this.url_json = `./src/data/${array[3]}.json`
		}

		console.log('dentro del scraping')
		let $ = await request({
			url: this.url,
			transform: body => cheerio.load(body)
		})
		console.log('se esta realizando el scraping de:', this.url)
		await $('.product-item__wrapper').each(  (i, item) => {

			if (  //  filtro
				(
					this.clearString($(item).find('p').text()) === "RestringidoEncuesta" ||
					this.clearString($(item).find('p').text()) === "Lanzamientos"

				) === true &&
				this.clearString($(item).find('.product-item__category').text()) === 'Sneakers' &&
				this.clearString($(item).find('.product-item__brand-name').text()) === 'Nike'
			)
			{
				let data =  {
					title: this.clearString($(item).find('p').text()) === 'Lanzamientos' ? 'Nuevo Lanzamiento' : 'Nuevo Producto',
			  	categoria: this.clearString($(item).find('.product-item__category').text()),
			  	name: this.clearString($(item).find('.product-item__name').text()),
			  	marca: this.clearString($(item).find('.product-item__brand-name').text()),
			  	departamento: this.clearString($(item).find('.product-item__department').text()),
			  	price: this.clearString($(item).find('.product-item__price').text()),
			  	url: $(item).find('.product-item__main-image').attr('href'),
			  	img: $(item).find('.product-item__main-image').children('img').attr('src')
				}

		   	 this.products.push(data)
			}

		})

		for await (let contador of this.products) { // recorre la información
			await this.validate(contador).then( async (res) => {  // valida la información que no se alla enviado
				if (await res === true) {
					await this.message(contador).then( async (respuesta) => { // enviar el mensage al discord
						await this.product_new.push(contador) // insertar data en el array
					})
				}else{
					console.log('esta data existe')
				}
			})
 		}

		console.log('pasando el await')
		console.log('logitud:',this.product_new.length)
		if ( await this.product_new.length > 0) { // actualizar la data en el json
			console.log('la nueva data del array:',this.product_new)
			await jsonWrite(this.url_json, this.product_new)
			console.log('ya se realizo el scraping de:', this.url)
			return true
		}
		console.log('ya se realizo el scraping de:', this.url)
		return true

	}

	async validate (product) {// validar y hacer la peticion al json para validar

	  for await (let contador of this.data_validation) {
	  	if (
			contador.name === product.name &&
			contador.categoria === product.categoria &&
			contador.price === product.price &&
			contador.url === product.url &&
			contador.img === product.img &&
			contador.departamento === product.departamento
			){
				return false // producto ya enviado
			}
 		}
		return true // nuevo producto

	}

 	clearString (text) { // limpia el formato obtenido del DOM

		if (text.trim().split('\n')[0] == 'Departamento') {
			let splice = text.trim().split(' ')
			return splice[splice.length - 1]
		}
		return text.trim()

	}

	async message(data) {

		await	getMessage(data).then( async (res) => {
			if (await res == true) {
				return true
			}
		})

	}

}

module.exports = Scraping