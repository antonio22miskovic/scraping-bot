const {jsonReader, jsonWrite, clearString} = require('../src/helpers.js')
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
		this.array_json = []

	}

	async scrapingPage (url) { // iniciador

		try {

			var elements = []
			this.url = await url

			await this.urlJson()

			console.log('dentro del scraping')
			let $ = await request({
				url: this.url,
				transform: body => cheerio.load(body)
			})
			console.log('se esta realizando el scraping de:', this.url)

				// obteniendo la data de los json
			await this.getJsonValidate().then( res => { this.array_json = res })

			await $('.product-item__wrapper').each( (i, item) => { // ajuntar los elementos en un array
				elements.push(item)
			})

			for await(let item of  elements) {

				if ( await  //  filtro
					// nuevo o lanzamiento
						(
							clearString($(item).find('p').text()) === "RestringidoEncuesta"||
							clearString($(item).find('p').text()) === "Lanzamientos"
						) &&
						clearString($(item).find('.product-item__category').text()) === 'Sneakers' &&
					  clearString($(item).find('.product-item__brand-name').text()) === 'Nike'
					)
				{

					let data = await {
						title: clearString($(item).find('p').text()) === 'Lanzamientos' ? 'Nuevo Lanzamiento' : 'Nuevo Producto',
				  	categoria: clearString($(item).find('.product-item__category').text()),
				  	name: clearString($(item).find('.product-item__name').text()),
				  	marca: clearString($(item).find('.product-item__brand-name').text()),
				  	departamento: clearString($(item).find('.product-item__department > div > ul > li').text()),
				  	price: clearString($(item).find('.product-item__price > .price-new').text()),
				  	url: $(item).find('.product-item__main-image').attr('href'),
				  	img: $(item).find('.product-item__main-image').children('img').attr('src')
					}

					let array_confir = []
					for await (let json of this.array_json){
						let e = await json.find( element => element.url === data.url)
						if (await e === undefined) {
							await array_confir.push(true)  // nuevo producto
						}else{
							await array_confir.push(false) // producto ya enviado
						}

					}
					let comprobante = await array_confir.find(element => element === false)

					if (await comprobante === undefined) {
						console.log('producto aprobado')
						await this.products.push(data)
					}else{
						console.log('producto ya enviado')
					}

				}
			}
			console.log('productos aprobados',this.products.length)

			if (await this.products.length > 0) {
				await this.message(this.products).then( async (new_product) => { // enviar el mensage al discord
					this.product_new = await new_product // insertar data en el array
				})
			}
			console.log('productos enviados:',this.product_new.length)
			console.log('json a editar:', this.url_json)
			if ( await this.product_new.length > 0) { // actualizar la data en el json
				await this.saveData(this.url_json, this.product_new).then( async (res) => {
					if (await res == true) {
						return true
					}
				})
			}else{
				return true
			}

		} catch(e) {

			console.log(e);
			console.log('error con esa url');
			return true
		}
	}


	async saveData(path,data){
		await jsonWrite(path,data).then( async (res) => {
			if (await res == true) {
				return true
			}
		})
	}

	async message(products) {
		let product_enviados = []
		for await (let product of products) {
			await	getMessage(product).then( async (res) => {
				if (await res.confirm == true) {
					product_enviados.push(res.item)
					console.log('mensaje enviado')
				}else{
					console.log('mensaje no enviado')
				}
			})
		}
		return product_enviados
	}

	async getJsonValidate() {
		let taf = await require('../src/data/taf.json')
		let calzado = await require('../src/data/calzado.json')
		let dunk = await require('../src/data/dunk.json')
		let hombre = await require('../src/data/hombre.json')
		let hombre_calzado = await require('../src/data/hombre_calzado.json')
		let mujer = await require('../src/data/mujer.json')
		let mujer_calzado = await require('../src/data/mujer_calzado.json')
		let specificationFilter_19 = await require('../src/data/Ni%C3%B1o?O=OrderByReleaseDateDESC&PS=12&map=specificationFilter_19.json')
		let nike = await  require('../src/data/nike.json')
		let taf_kids_calzado = await require('../src/data/taf-kids_calzado.json')

		return [
			taf,
			calzado,
			dunk,
			hombre,
			hombre_calzado,
			mujer,
			mujer_calzado,
			specificationFilter_19,
			nike,
			taf_kids_calzado
		]
	}

	async urlJson () {

		if (await this.url === 'https://www.taf.com.mx/') {
			this.data_validation = await require('../src/data/taf.json')
			this.url_json = './src/data/taf.json'
		}else{
			let array = await this.url.trim().split('/')
			if (array[4] !== undefined) {
					this.data_validation = await require(`../src/data/${array[3]}_${array[4]}.json`)
				this.url_json = `./src/data/${array[3]}_${array[4]}.json`
			}else{
				this.data_validation = await require(`../src/data/${array[3]}.json`)
				this.url_json = `./src/data/${array[3]}.json`
			}
		}

	}

}

module.exports = Scraping