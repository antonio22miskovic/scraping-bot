const dotenv = require('dotenv').config();
const {Client, MessageEmbed} = require('discord.js')
const client = new Client()

// client.on('ready', () => {
// 	console.log('conectado a discord')
// })//1

client.on('message', message => {

	if (message.content === 'ping'){
		message.reply('pong')
	}
	if (message.content === 'hello'){
		message.channel.send(`Bienvenido ${message.author}!`)
	}
	if(message.content.includes('!test')){
		message.channel.send(`Gracias por comunicarte ${message.author}!`)
	}
	// if(message.content.includes('!fast')){
	// 	message.channel.send('https://www.youtube.com/watch?v=EUB777JJT5E&t=88s')
	// }
})

// client.login(process.env.DISCORD_TOKEN)

module.exports = {
	client,
	MessageEmbed
}