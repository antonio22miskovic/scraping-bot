const cheerio = require('cheerio')
const fs = require('fs')
const request = require('request-promise')

const jsonReader = (filePath,cb) => {
	fs.readFile(filePath, "utf-8", (err, jsonString) => {
		if (err) {
			return cb && cb(err)
		}
		try {
			let json =JSON.parse(jsonString)
			return cb && cb(null,json)
		} catch(e) {
			return cb && cb(err)
		}
	})
}

const jsonWrite = (filePath,newFile) => {

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