const {client, MessageEmbed} = require('./discord.js')
const {initTaf} = require('./taf/index.js')
const cron = require('node-cron')

client.on('ready', () => {
 	console.log('conectado a discord')
 })//1
client.login('ODM3NzgxOTg1OTgzNTk0NTQ2.YIxjRg.wGP9iIDgE7NUhQRnzFPokzVm4SU')

cron.schedule('15 0 0 * * *',() => {
	  initTaf()
})






// elmosquedacordova@gmail.com
// Tester2020



