require('dotenv').config()
const Masto = require('masto')

const TWEET_INTERVAL_MIN = 1 / 60
const TWEET_INTERVAL_MS = 1000 * 60 * TWEET_INTERVAL_MIN

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


const rollChance = (part, whole) => {
	const roll = getRandInt(1, whole)
	if (roll <= part) return true
	return false
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

const laughSprinkle = (min = 0, max = 4) => {
	const rand = getRandInt(min, max)
	let sprinkle = ''

	if (rollChance(1 / 2))
		for (let i = 0; i < rand; i++) {
			sprinkle += "😂"
			if (rollChance(1, 4)) sprinkle += ' ' // stick extra space in there sometimes
		}
	return sprinkle
}

const prefix = () => {
	if (rollChance(2, 3)) return ""
	const opts = ["", "LOL!", "this one is FUNNY ", "humor", "lolll", "hahaaa", "i'm dyinggg"]
	const rand = getRandInt(0, opts.length - 1)
	const final = `${opts[rand]} `
	return final
}

const exacerbator = () => {
	if (rollChance(1, 2)) return ""
	const opts = ["", "LOL!", "loll...", "lolll", "hahaaa", "omgg", "💀"]
	const rand = getRandInt(0, opts.length - 1)
	const final = `${opts[rand]} `
	return final
}

const writeReply = (origMsg) => {
	const replyMsg = `${prefix()}${laughSprinkle()} they said ${origMsg} ${exacerbator()}${laughSprinkle(1, 4)}`
	console.log(`reply: ${replyMsg}`)

	return replyMsg
}


const getTimeline = async (limit = 5) => {
	const result = await m.v1.timelines.public.list({
		limit: limit,
	})
	return result
}

/**
 * removes <p> tags wrapping input text
 * @param {string} text - original text to scrub
 * @returns scrubbed, <p>-free text
 */
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
	const replyMsg = writeReply(origMsg)

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

setInterval(() => {
	writeReply("testing")
}, TWEET_INTERVAL_MS)