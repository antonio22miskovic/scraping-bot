const cheerio = require('cheerio')
const fs = require('fs')
const request = require('request-promise')

const jsonReader = (filePath) => { // cargar archivo json

	fs.readFile(filePath, "utf-8", (err, jsonString) => {
		try {
			return JSON.parse(jsonString)
		} catch(e) {
			return err
		}
	})

}

const jsonWrite = async (filePath,newFile) => { // sobre escribir archivo json

	await fs.writeFile(filePath,JSON.stringify(newFile), err => {
		if (err) {
			console.log(err)
		}else{
			console.log('json editado')
			return true
		}
	})

}

const clearString = (text) => { // limpia el formato obtenido del DOM
	return text.trim()
}

const clearResultArray = async (array) => {

	let itmesMap = await array.map(item => {
	    return [item.url,item]
	});
	var itmesMapArr = await new Map(itmesMap); // items de clave y valor

	let result = [...itmesMapArr.values()]; // Conversión a un array

	return result

}

module.exports = {
	jsonReader,
	jsonWrite,
	clearString,
	clearResultArray
}