const {client, dotenv} = require('./src/discord.js')
const env = require('dotenv')
const Scraping = require('./src/scraping.js')
const cron = require('node-cron')

const urls = [
	'https://www.taf.com.mx/calzado',
	'https://www.taf.com.mx/',
	'https://www.taf.com.mx/dunk',
	'https://www.taf.com.mx/mujer/calzado/sneakers',
	'https://www.taf.com.mx/hombre/calzado/sneakers',
	'https://www.taf.com.mx/taf-kids/calzado/sneakers',
]

const pageScraping = async () => {

	await client.on('ready', () => {
 		console.log('conectado a discord')
	 })// verificar conexión con discord
	console.log('urls:',urls)
	for await (let url of urls){
		console.log('url en turno:', url)
		await new Scraping().scrapingPage(url).then(res => {
			if (res  == true) {
				console.log(`la pagina ${url} ya fue procesada`)
			}
		})
	}

}

cron.schedule('*/2 * * * *', () => { // cronometro cada aproximadamente 2 minutos se realiza el scraping

	pageScraping()

})

client.login(process.env.DISCORD_TOKEN)



