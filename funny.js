
require('dotenv').config()

const Masto = require('masto')

const m = Masto.createRestAPIClient({
	url: 'https://networked-media.itp.io',
	accessToken: process.env.TOKEN
})

/**
 * 
 */
const makeStatus = async () => {
	const s = await m.v1.statuses.create({
		status: "hi",
		visibility: 'public'
	})
}

makeStatus()