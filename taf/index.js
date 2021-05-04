const {jsonReader, jsonWrite} = require('../helpers.js')
const {getMessage} = require('../taf/message.js')
const cheerio = require('cheerio')
const request = require('request-promise')

class Taf {

	constructor(url){ // constructor

		// this.url = "https://www.taf.com.mx/"
		this.url = url
		if (this.url === "https://www.taf.com.mx/dunk") {
			this.data_validation = require('../taf/tafDuck.json')
		}else{
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
		await $('.product-item__wrapper').each( (i, item) => {
				if (this.url === "https://www.taf.com.mx/dunk") {
					this.dataSetArrayDuck(item,$)
				}else{
					this.dataSetArray(item,$)
				}
		})
		console.log('la nueva data del array:',this.product_new)
		if (this.product_new.length > 0) {
			if (this.url === "https://www.taf.com.mx/dunk") {
				await jsonWrite('../taf/tafDuck.json' ,this.product_new)
		}
		}else{
		 	await jsonWrite('../taf/taf.json' ,this.product_new)
		}

	}

	async validate (product) {// validar y hacer la peticion al json para validar
			if (this.validate_product(product) === true) {
				if (this.validateMessage(product)=== true) {
					return true // nuevo producto
				}else{
					return false
				}
			}else{
				return false // producto ya enviado
			}
	}

 validate_product (product) { // busca en el archivo json datos que no existan

 		try {
			for (var i = 0; i < this.data_validation.length; i++) {
				if (
					this.data_validation[i].name === product.name &&
					this.data_validation[i].categoria === product.categoria &&
					this.data_validation[i].price === product.price &&
					this.data_validation[i].url === product.url &&
					this.data_validation[i].img === product.img &&
					this.data_validation[i].departamento === product.departamento
				){
					return false // producto ya enviado
				}
			}
			return true // nuevo producto
 		} catch(e) {
 			console.log(e);
 		}

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
			this.clearString($(item).find('p').text()) === "RestringidoEncuesta" &&
			this.clearString($(item).find('.product-item__category').text()) === 'Sneakers' &&
			this.clearString($(item).find('.product-item__brand-name').text()) === 'Nike'
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
			// console.log('get data', data)
			await this.validate(data).then(res => {
				if (res === true) {
					this.message(data)
					this.product_new.push(data)
					// console.log('insertando en el array',this.product_new)
				}else{
					console.log('esta data existe')
				}
			}).catch(err => {
				console.log(err)
			})
		}
	}

	validateMessage (product) { // validar que no venga el mismo producto en el scraping

		try {
			for (var i = 0; i < this.product_new.length; i++) {
				if (
					this.product_new[i].name === product.name &&
					this.product_new[i].categoria === product.categoria &&
					this.product_new[i].price === product.price &&
					this.product_new[i].url === product.url &&
					this.product_new[i].img === product.img &&
					this.product_new[i].departamento === product.departamento
				){
					return false // producto ya enviado
				}
			}
			return true // nuevo producto
 		} catch(e) {
 			console.log(e);
 		}

	}

	async message(data) {

		await	getMessage(data)

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
		// console.log('get data', data)
		await this.validate(data).then(res => {
			if (res === true) {
				this.message(data)
				this.product_new.push(data)
				// console.log('insertando en el array',this.product_new)
			}else{
				console.log('esta data existe')
			}
		}).catch(err => {
			console.log(err)
		})
	}

}

module.exports = Taf