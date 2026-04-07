require('dotenv').config()
const Masto = require('masto')

const m = Masto.createRestAPIClient({
	url: 'https://networked-media.itp.io',
	accessToken: process.env.TOKEN
})

const validateContent = () => {

}

/**
 * gives random integer between `min` and `max`, inclusive
 * @param {number} min - lowest integer to roll
 * @param {number} max - highest integer to roll
 * @returns random int
 */
const getRandInt = (min, max) => {
	const range = max - min
	let rand = Math.random() * (range + 1)
	rand = rand + min
	rand = Math.floor(rand)
	return rand
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

const getTimeline = async () => {
	const result = await m.v1.timelines.public.list({
		limit: 30,
	})
	console.log(result[1])
	return result[0]
}

getTimeline()

const replyToStatus = async (statusId, msg) => {

	const reply = await m.v1.statuses.create({
		inReplyToId: statusId,
		status: msg,
		visibility: "private"
	})
	console.log(reply)
	console.log(`reply link: ${reply.url}`)
}

// get most recent post

// run async!
(async () => {
	const lastPost = await getTimeline()
	const exStatId = lastPost.id


	console.log(`status id: ${exStatId}`)

	replyToStatus(exStatId, "lolll")
})()

//setInterval(makeStatus, 10000)