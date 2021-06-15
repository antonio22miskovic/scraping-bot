const dotenv = require('dotenv').config();
const {Client, MessageEmbed} = require('discord.js')
const env = require('dotenv')
const client = new Client()

const getMessage = async (product) => {
    try {
    	let id = await client.channels.cache.find(channel => channel.name === process.env.DISCORD_NAME_CHANNEL)
    	let embed = await new MessageEmbed()
        .setTitle(product.title)
        .setColor(0x00AE86)
        .setFooter(`${product.title} en taf`, product.url)
        .setImage(product.img)
        .setThumbnail(product.img)
        .setTimestamp()
        .setURL(product.url)
        .addField(product.name, product.categoria, true)
        .addField(product.price, product.marca, true)
    	await client.channels.cache.get(id.id).send({embed})
    	console.log('mensaje enviado')
    	return {
            confirm:true,
            item: product
        }
    } catch(e) {
       return {
            confirm:false,
            item: product
        }
    }

}

module.exports = {
	getMessage,
	client,
	dotenv
}