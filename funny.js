require('dotenv').config()
const Masto = require('masto')

const TWEET_INTERVAL_MIN = 30
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

	if (rollChance(2, 3))
		for (let i = 0; i < rand; i++) {
			sprinkle += "😂"
			if (rollChance(1, 4)) sprinkle += ' ' // stick extra space in there sometimes
		}
	return sprinkle
}

const prefix = () => {
	if (rollChance(2, 3)) return ""
	const opts = ["LOL!", "this one is FUNNY ", "humor", "lolll", "hahaaa", "i'm dyinggg"]
	const rand = getRandInt(0, opts.length - 1)
	const final = `${opts[rand]} `
	return final
}

const exacerbator = () => {
	if (rollChance(1, 2)) return ""
	const opts = ["LOL!", "loll...", "lolll", "hahaaa", "omgg", "💀"]
	const rand = getRandInt(0, opts.length - 1)
	const final = `${opts[rand]} `
	return final
}

const hashtag = () => {
	if (rollChance(1, 4)) return ""
	const opts = ["LOL", "lol", "funny", "humor", "jokes", "haha"]
	const rand = getRandInt(0, opts.length - 1)
	const final = `#${opts[rand]} `
	return final
}

const writeReply = (origMsg) => {
	let pref = prefix()
	let spr1 = laughSprinkle()
	let qMark = ''
	let exac = exacerbator()
	let spr2 = laughSprinkle(1, 4)

	// inject laugh if it's otherwise blank
	if (pref.trim() == "" &&
		spr1.trim() == "" &&
		exac.trim() == "" &&
		spr2.trim() == "") {
		pref = "😂😂"
	}

	// randomize order of clauses
	let p1, p2, p3, p4
	if (rollChance(1, 2)) {
		p1 = pref
		p2 = spr1
	} else {
		p1 = spr1
		p2 = pref
	}
	if (rollChance(1, 2)) {
		p3 = exac
		p4 = spr2
	} else {
		p3 = spr2
		p4 = exac
	}

	/*
	let ht1 = '', ht2 = '', ht3 = '', ht4 = ''
	const roll = getRandInt(1, 4)
	if (roll === 1) ht1 = hashtag()
	if (roll === 2) ht2 = hashtag()
	if (roll === 3) ht3 = hashtag()
	if (roll === 4) ht4 = hashtag()
	*/

	let ht1 = hashtag()
	let ht2 = hashtag()
	let ht3 = hashtag()
	let ht4 = hashtag()

	// wrap original tweet in quotes if short enough, or random
	if (origMsg.length <= 7 || rollChance(1, 3)) qMark = '"'

	let replyMsg = `${p1}${ht1}${p2}${ht2} they said ${qMark}${origMsg}${qMark} ${p3}${ht3}${p4}${ht4}`
	replyMsg = replyMsg.trim()
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
		visibility: 'public'
	})
	console.log(`replied to @${target.account.username}: "${origMsg}"
		with "${replyMsg}"`)
	console.log(`link: ${reply.url}`)
}

pushSlop()

setInterval(() => {
	//writeReply("testing")
	pushSlop()
}, TWEET_INTERVAL_MS)