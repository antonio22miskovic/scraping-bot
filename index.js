const {client, MessageEmbed} = require('./discord.js')
const {initTaf} = require('./taf/index.js')
const cron = require('node-cron')

client.on('ready', () => {
 	console.log('conectado a discord')
 })//1
// client.login('ODM3NzgxOTg1OTgzNTk0NTQ2.YIxjRg.wGP9iIDgE7NUhQRnzFPokzVm4SU')
client.login('ODM2MjQ1NzI4Mjk2ODI4OTkw.YIbMhg.3cerBRNlet7JjN70FI_iVwxAbWs') //mio

cron.schedule('15 * * * * *',() => {
	  initTaf()
})






// elmosquedacordova@gmail.com
// Tester2020



