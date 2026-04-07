require('dotenv').config()
const Masto = require('masto')

const m = Masto.createRestAPIClient({
	url: 'https://networked-media.itp.io',
	accessToken: process.env.TOKEN
})

// TODO
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

// UNUSED
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


const getTimeline = async (limit = 5) => {
	const result = await m.v1.timelines.public.list({
		limit: limit,
	})
	return result
}

const scrubPs = (text) => {
	return text.substring(3, text.length - 4)
}

/**
 * main running function
 */
const pushSlop = async () => {
	// TODO: 1. get random most recent post
	const timeline = await getTimeline(5)
	const target = timeline[getRandInt(0, 4)]

	// TODO: 2. author a reply to the post
	const origMsg = scrubPs(target.content)
	const replyMsg = `they said ${origMsg} 😂😂😂`

	// TODO: 3. validate reply to post against server rules

	// TODO: 4. publish post
	const reply = await m.v1.statuses.create({
		inReplyToId: target.id,
		status: replyMsg,
		visibility: 'private'
	})
	console.log(`replied to @${target.account.username}: "${origMsg}"
		with "${replyMsg}"`)
	console.log(`link: ${reply.url}`)
}

pushSlop()


//setInterval(makeStatus, 10000)