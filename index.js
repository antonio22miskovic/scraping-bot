const {client, dotenv} = require('./src/discord.js')
const env = require('dotenv')
const Scraping = require('./src/scraping.js')
const cron = require('node-cron')

const urls = [
	'https://www.taf.com.mx/',
	'https://www.taf.com.mx/calzado',
	'https://www.taf.com.mx/mujer/calzado/sneakers',
	'https://www.taf.com.mx/hombre/calzado/sneakers',
	'https://www.taf.com.mx/taf-kids/calzado/sneakers',
]

const pageScraping = async () => {

	await client.on('ready', () => {
 		console.log('conectado a discord')
	 })// verificar conexión con discord

	for await (let url of urls){
		await new Scraping(url).scrapingPage()
	}

}

cron.schedule('*/2 * * * *', () => { // cronometro cada aproximadamente 2 minutos se realiza el scraping

	pageScraping()

})

client.login(process.env.DISCORD_TOKEN)



