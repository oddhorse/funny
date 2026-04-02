require('dotenv').config()
const Masto = require('masto')

const m = Masto.createRestAPIClient({
	url: 'https://networked-media.itp.io',
	accessToken: process.env.TOKEN
})

const validateContent = () => {

}

/**
 * 
 */
const makeStatus = async () => {
	let rand = Math.floor(Math.random() * 6)
	console.log(`we doing ${rand} this time`)

	let msg = ''
	for (let i = 0; i < rand; i++) msg += "😂"

	console.log(`msg: ${msg}`)
	const s = await m.v1.statuses.create({
		status: msg,
		visibility: 'public'
	})
	console.log(`status link: ${s.url}`)

}

makeStatus()

setInterval(makeStatus, 10000)