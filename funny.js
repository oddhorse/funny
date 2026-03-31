const Express = require('express')
const Env = require('dotenv')

const app = Express()

const dot = Env.

const getAllPosts = async (params) => {
	const url = "https://networked-media.itp.io/api/v1/timelines/public?limit=2"



	const response = await fetch(url, {
		headers: {
			"Authorization": "Bearer ",
		}
	})
	let posts = await response.json()
	console.log(posts)
}

app.listen(4005, () => {
	console.log("app running on http://localhost:4005")
	getAllPosts()
})


