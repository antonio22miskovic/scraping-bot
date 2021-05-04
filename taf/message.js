const {client, MessageEmbed} = require('../discord.js')

const getMessage = async (result) => {

	// let id = await client.channels.cache.find(channel => channel.name === "test")
	let id = await client.channels.cache.find(channel => channel.name === "general")
	let embed = await new MessageEmbed()
    .setTitle("Nuevo Producto")
    .setColor(0x00AE86)
    .setFooter("Nuevo Producto en Taf", result.url)
    .setImage(result.img)
    .setThumbnail(result.img)
    .setTimestamp()
    .setURL(result.url)
    .addField(result.name, result.categoria, true)
    .addField(result.price, result.marca, true)
	await client.channels.cache.get(id.id).send({embed})
	console.log('mensaje enviado')
	return true
}

module.exports = {
	getMessage
}