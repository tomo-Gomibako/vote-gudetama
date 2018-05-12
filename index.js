const puppeteer = require("puppeteer")
const promisify = require("util").promisify
const fs = require("fs")
const stat = promisify(fs.stat)
const mkdir = promisify(fs.mkdir)
const request = require("request")

const vote = async () => {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()
	await page.setViewport({
		width: 1200,
		height: 1800
	})
	await page.goto("https://sanriocharacterranking.com/characters/gudetama/?=vote")
	try {
		await stat("screenshots/")
	} catch(err) {
		await mkdir("screenshots/")
	}
	await page.screenshot({ path: "screenshots/1.png" })
	await page.click("#js-modalConfirm_vote")
	// await page.waitForNavigation("networkidle0")
	await page.screenshot({ path: "screenshots/2.png" })
	const age = (Math.random() * 15 | 0) + 5
	const gender = 1
	const region = (Math.random() * 47 | 0) + 1
	console.log(age, gender, region)
	await page.select("#userSelect-age", "" + age)
	await page.select("#userSelect-gender", "" + gender)
	await page.select("#userSelect-area", "" + region)
	await page.click(".mainContent_form_agree_checkLabel").catch(e => { console.log(e) })
	await page.screenshot({ path: "screenshots/3.png" })
	await page.waitFor(2000)
	await page.click("#js-btnVote")
	await page.screenshot({ path: "screenshots/4.png" })
	await page.waitFor(2000)
	await page.click("#js-modalConfirm_vote")
	await page.waitFor(2000)
	await page.screenshot({ path: "screenshots/5.png" })
	// await page.waitForNavigation("networkidle0")
	await browser.close()
}
const wait = (ms) => {
	return new Promise((resolve, reject) => {
		try {
			setTimeout(() => {
				resolve()
			}, ms)
		} catch(err) {
			reject(err)
		}
	})
}
const post = async (text) => {
	request.post({
		url: "https://slack.com/api/chat.postMessage",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({
			token: "xoxp-309436344468-309454235106-363732822951-3a9e5ad38d99a2fda8a5470f0b0ec39d",
			channel: "D92PM6KU0",
			text: `${ text }`
		})
	})
}
const main = async () => {
	const loop = 2000
	for(let i = 0; i < loop; i++) {
		await vote().catch(err => {
			// await post(err)
		})
		console.log(`投票 ${ i + 1 }回目`)
		if(i % 50 === 0) {
			// await post(`投票 ${ i + 1 }回目`)
		}
		if(i !== loop - 1) await wait(1000)
	}
}

main()
