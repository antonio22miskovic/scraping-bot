const {client, dotenv} = require('./src/discord.js')
const env = require('dotenv')
const Scraping = require('./src/scraping.js')
const StockScraping = require('./src/stock.js')
const cron = require('node-cron')
const PORT = process.env.PORT || 5000;

const urls = [
	'https://www.taf.com.mx/calzado',
	'https://www.taf.com.mx/nike',
	'https://www.taf.com.mx/hombre',
	'https://www.taf.com.mx/mujer',
	'https://www.taf.com.mx/taf-kids',
	'https://www.taf.com.mx/Ni%C3%B1o?O=OrderByReleaseDateDESC&PS=12&map=specificationFilter_19',
	'https://www.taf.com.mx/',
	'https://www.taf.com.mx/dunk',
	'https://www.taf.com.mx/mujer/calzado/sneakers',
	'https://www.taf.com.mx/hombre/calzado/sneakers',
	'https://www.taf.com.mx/taf-kids/calzado/sneakers'
]


const pageScraping = async () => {

	await client.on('ready', () => {
 		console.log('conectado a discord')
	})// verificar conexión con discord
	for await (let url of urls){
		console.log('url en turno:', url)
		await new Scraping().scrapingPage(url).then( async (res) => {
			if (await  res  == true) {
				console.log(`la pagina ${url} ya fue procesada`)
			}
		})
	}
}

const pageScrapingStock = async () => {

	await client.on('ready', () => {
 		console.log('conectado a discord')
	})

	await new StockScraping().urlStock()

}

cron.schedule('*/2 * * * *', () => { // cronometro cada aproximadamente 2 minutos se realiza el scraping
 	pageScrapingStock()
})

client.login(process.env.DISCORD_TOKEN)

