const {jsonReader, jsonWrite, clearString, clearResultArray} = require('../src/helpers.js')
const {getMessage} = require('../src/discord.js')
const cheerio = require('cheerio')
const request = require('request-promise')


class StockScraping { // este objeto se encargara de administrar el stock de la pagina
	// calculando cuando no alla stock disponible en la pagina

	constructor(){ // constructor

		this.url = null
		this.products = []
		this.vueltas = [1]
		this.contador = 1
		this.path_json = './src/data/stock/stock.json'
		this.data_edit_json = null
		this.products_off = []
		this.new_stock = []
		this.old_product = null
		this.stock_true_new = []
		this.jsons = null

	}

	async urlStock () {

		var elements = []

		this.old_product = await require('../src/data/stock/stock.json')

		for await (let scroll of this.vueltas) {

			if ( await this.contador === 1) {

				this.url = 'https://www.taf.com.mx/nike'

			}else{

				this.url = `https://www.taf.com.mx/buscapagina?fq=B%3a2000004&PS=12&sl=fb15d19c-d54e-48b1-8554-ca61c56a631e&cc=12&sm=0&PageNumber=${this.contador}`
			}

			console.log('se esta realizando el scraping de:', this.url)

			let $ = await request({ // hacemis la peticion
				url: this.url,
				transform: body => cheerio.load(body)
			},(err, res, body) => {

		    if (err){
		    	console.log('fallo la petición')
		    	console.error(err);
		    	return true
		    }
			})

			await $('.product-item__wrapper').each( (i, item) => { // ajuntar los elementos en un array
				elements.push(item)
			})

			for await(let item of  elements) {

				if ( await  //  filtro
					// nuevo o lanzamiento
						clearString($(item).find('.product-item__category').text()) === 'Sneakers' &&
					  clearString($(item).find('.product-item__brand-name').text()) === 'Nike'
					)
				{
					let title = null
					if (
						clearString($(item).find('p').text()) === "RestringidoEncuesta"||
						clearString($(item).find('p').text()) === "Lanzamientos"
						) {
						title = clearString($(item).find('p').text()) === 'Lanzamientos' ? 'Nuevo Lanzamiento' : 'Nuevo Producto'
					}else{
						title = 'Stock Renovado'
					}

					let data = await {
						title:title,
				  	categoria: clearString($(item).find('.product-item__category').text()),
				  	name: clearString($(item).find('.product-item__name').text()),
				  	marca: clearString($(item).find('.product-item__brand-name').text()),
				  	departamento: clearString($(item).find('.product-item__department > div > ul > li').text()),
				  	price: clearString($(item).find('.product-item__price > .price-new').text()),
				  	url: $(item).find('.product-item__main-image').attr('href'),
				  	img: $(item).find('.product-item__main-image').children('img').attr('src'),
				  	stock:true
					}
					this.products_off.push(data)
				}
			}
			console.log('cantidad de productos:',this.products_off.length)
			if ($('.product-item__wrapper').html() === null) {

				console.log('termino la recopilación de productos')
				await this.detectar()


			}else{
				this.contador = this.contador + 1
				this.vueltas.push(this.contador)
			}
		}


	}

	async detectar () {

		await clearResultArray(this.products_off).then(res => { // limpiar los productos repetidos
					this.products = res
					console.log('resultado final sin productos repetidos:',this.products.length)
		})

		// buscar si hay habilitado un nuevo producto en el stock comparando con los del json
		let sin_stock = await this.old_product.filter(element => element.stock === false)


		///////// productos que no aparecen en el array ////////7
		for await (let pro of this.products){
			let p = await this.old_product.find(element => element.url === pro.url)
			if (p === undefined) {
				console.log('metiendo el nuevo producto:',pro)
				this.new_stock.push(pro) // prodcutos nuevos
			}
		}
		///////// fin productos que no aparecen en el array ////////7

	////// buscar si ya hay nuevo stock hablilitado ////
		if (sin_stock.length > 0) {
			for await (let old of sin_stock){
				let stock_true = await this.products.find(element => element.url === old.url)
				if (stock_true !== undefined) {
			 		this.new_stock.push(stock_true)
				}
			}
		}
	////// fin buscar si ya hay nuevo stock hablilitado ////

		////////// detectar stock agotado //////////7
		for await (let i of this.old_product){
			let com = await this.products.find(element => element.url === i.url)
			if (com === undefined) {
				console.log('producto con stock agotado')
				await this.old_product.map( dato => {
					if(dato.url === i.url && dato.stock === true){
						console.log('producto con stock agotado cambiado a false')
						dato.title = 'Stock Renovado'
						dato.stock = false
					}
					return dato
				})
			}
		}
		////////// fin detectar stock agotado //////////7


		////////////// enviar mensaje ///////////////

		if (this.new_stock.length > 0) {
		  await this.message(this.new_stock).then( async (new_product) => { // enviar el mensage al discord
		  	for await (let pro of new_product) {
		  	 let p = await this.old_product.find(element => element.url === pro.url)
			  	 	if (p === undefined) {
			  	 		this.old_product.push(pro)
			  	 	}else{
							await this.old_product.map( dato => {
								if(dato.url == pro.url){
									dato.stock = true
								}
								return dato
							})
			  	 	}
		  	}
				console.log('mensajes enviados',new_product.length) // insertar data en el array
			})
		  await jsonWrite(this.path_json,this.old_product)
		}else{
			console.log('no hay mensajes que enviar')
		}
		////////////// fin enviar mensaje ///////////////

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

}

module.exports = StockScraping

