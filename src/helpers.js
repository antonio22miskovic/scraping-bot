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

const jsonWrite = (filePath,newFile) => { // sobre escribir archivo json

	fs.writeFile(filePath,JSON.stringify(newFile), err => {
		if (err) {
			console.log(err)
		}else{
			console.log('archivo escrito con exito')
		}
	})

}

module.exports = {
	jsonReader,
	jsonWrite
}