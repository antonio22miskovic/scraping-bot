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
			return true
		}
	})

}

const clearString = (text) => { // limpia el formato obtenido del DOM
	return text.trim()
}

module.exports = {
	jsonReader,
	jsonWrite,
	clearString
}