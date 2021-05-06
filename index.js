const {client, dotenv} = require('./src/discord.js')
const env = require('dotenv')
const Scraping = require('./src/scraping.js')
const cron = require('node-cron')

client.on('ready', () => {
 	console.log('conectado a discord')
 })// verificar conexión con discord

cron.schedule('59 * * * * *', () => { // pagina principal de productos

	const tafObject = new Scraping("https://www.taf.com.mx/").scrapingPage()
	const tafObject2 = new Scraping("https://www.taf.com.mx/dunk").scrapingPage()

})


client.login(process.env.DISCORD_TOKEN)



// elmosquedacordova@gmail.com
// Tester2020



