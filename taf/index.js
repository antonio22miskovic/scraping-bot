const {jsonReader, jsonWrite} = require('../helpers.js')
const {getMessage} = require('../taf/message.js')
const cheerio = require('cheerio')
const request = require('request-promise')

class Taf {

	constructor(url){ // constructor

		this.url = url
		if (this.url === "https://www.taf.com.mx/dunk") {
			this.page = 2
			this.data_validation = require('../taf/tafDuck.json')
		}else{
			this.page = 1
			this.data_validation = require('../taf/taf.json')
		}
		this.product_new = []

	}

	async scraping () { // iniciador
		console.log('dentro del scraping')
		let $ = await request({
			url: this.url,
			transform: body => cheerio.load(body)
		})
		console.log('ya se realizo el scraping')
		await $('.product-item__wrapper').each( async (i, item) => {
			if (await this.page === 2) {
				await this.dataSetArrayDuck(item,$)
			}else{
				console.log('contador:',i)
				await	this.dataSetArray(item,$)
			}
		})
		console.log('pasando el await')
		console.log('logitud:',this.product_new.length)
		if ( await this.product_new.length > 0) {
			console.log('la nueva data del array:',this.product_new)
			if ( await this.page === 2) {
				await jsonWrite('./taf/tafDuck.json' ,this.product_new)
			}else{
		 		await jsonWrite('./taf/taf.json' ,this.product_new)
			}
		}
	}

	async accumulateData (i,item) {

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

 		for await (let contador2 of this.product_new) {
	  	if (
					contador2.name === product.name &&
					contador2.categoria === product.categoria &&
					contador2.price === product.price &&
					contador2.url === product.url &&
					contador2.img === product.img &&
					contador2.departamento === product.departamento
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

	async dataSetArray (item,$) { // organiza la data, valida, filtra y envia en mensaje
		if (
				await this.clearString($(item).find('p').text()) === "RestringidoEncuesta" &&
				await this.clearString($(item).find('.product-item__category').text()) === 'Sneakers' //&&
			// await this.clearString($(item).find('.product-item__brand-name').text()) === 'Nike'
		) {
			let data = await {
		  	categoria: this.clearString($(item).find('.product-item__category').text()),
		  	name: this.clearString($(item).find('.product-item__name').text()),
		  	marca: this.clearString($(item).find('.product-item__brand-name').text()),
		  	departamento: this.clearString($(item).find('.product-item__department').text()),
		  	price: this.clearString($(item).find('.product-item__price').text()),
		  	url: $(item).find('.product-item__main-image').attr('href'),
		  	img: $(item).find('.product-item__main-image').children('img').attr('src')
			}
			await this.validate(data).then(async (res) => {
			if (await res === true) {
				await this.message(data).then(async (res) => {
					if ( await res == true) {
						await this.product_new.push(data)
					}
				})
			}else{
				console.log('esta data existe')
			}
		}).catch(err => {
			console.log(err)
		})
		}
		console.log('la data no cumple')
	}


	async message(data) {

		await	getMessage(data).then( async (res) => {
			if (await res == true) {
				return true
			}
		})

	}

	async dataSetArrayDuck(item,$){

		let data = await {
	  	categoria: this.clearString($(item).find('.product-item__category').text()),
	  	name: this.clearString($(item).find('.product-item__name').text()),
	  	marca: this.clearString($(item).find('.product-item__brand-name').text()),
	  	departamento: this.clearString($(item).find('.product-item__department').text()),
	  	price: this.clearString($(item).find('.product-item__price').text()),
	  	url: $(item).find('.product-item__main-image').attr('href'),
	  	img: $(item).find('.product-item__main-image').children('img').attr('src')
		}
		await this.validate(data).then(async (res) => {
			if (await res === true) {
				await this.message(data).then(async (res) => {
					if ( await res == true) {
						await this.product_new.push(data)
					}
				})
			}else{
				console.log('esta data existe')
			}
		}).catch(err => {
			console.log(err)
		})
	}
}

module.exports = Taf