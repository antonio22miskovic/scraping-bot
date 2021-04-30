const {jsonReader, jsonWrite} = require('../helpers.js')
const {getMessage} = require('../taf/message.js')
const cheerio = require('cheerio')
const request = require('request-promise')
const product_new = []

const initTaf = async () => {
	jsonReader('./page.json',(err, data) => {
		if (err) {
			console.log(err)
		}else{
			ScrapingTaf(data[8].url)
		}
	})
	// jsonWrite('./taf/taf.json' ,data)
}

const ScrapingTaf = async (page) => {
	let $ = await request({
		url:page,
		transform: body => cheerio.load(body)
	})
	console.log('haciendo el scraping de' + page)
	await $('.product-item__wrapper').each( (i, item) => {
		dataSetArray(item,$)
	})
	// // jsonWrite('./taf/taf.json' ,product_old)
	// if (product_new.length > 0) {
	// 	// console.log(product_new[3])
	// 	getMessage(product_new[3])
	// 	// jsonWrite('./taf/taf.json' ,product_new)
	// }
}

const validate = (element) => {
	jsonReader('./taf/taf.json',(err, data) => {
		if (err) {
			console.log(err)
		}else{
			console.log('la data:',data)
			if (data.length <= 0) {
				return true
			}
			for (var i = 0; i <= data.length; i++) {
				if (
					data[i].name === element.name &&
					data[i].categoria === element.categoria &&
					data[i].price === element.price &&
					data[i].url === element.url &&
					data[i].img === element.img &&
					data[i].departamento === element.departamento
				){
					return false
				}
			}
			return true
		}
	})
}

const clearString = (text) => {
	if (text.trim().split('\n')[0] == 'Departamento') {
		let splice = text.trim().split(' ')
		return splice[splice.length - 1]
	}
	return text.trim()
}

const dataSetArray = async (item,$) => {
	if (clearString($(item).find('p').text()) === "RestringidoEncuesta") {
		let data = await {
		  	categoria: clearString($(item).find('.product-item__category').text()),
		  	name: clearString($(item).find('.product-item__name').text()),
		  	departamento: clearString($(item).find('.product-item__department').text()),
		  	price: clearString($(item).find('.product-item__price').text()),
		  	url: $(item).find('.product-item__main-image').attr('href'),
		  	img: $(item).find('.product-item__main-image').children('img').attr('src')
		}
		await	getMessage(data)
		// if(validate(data) == true){
			product_new.push(data)
		// }
	}
}

module.exports = {
	initTaf,
}