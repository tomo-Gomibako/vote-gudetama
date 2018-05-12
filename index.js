const puppeteer = require("puppeteer")
const promisify = require("util").promisify
// const fs = require("fs")
// const stat = promisify(fs.stat)
// const mkdir = promisify(fs.mkdir)

const clearCookies = async (page) => {
	const cookies = await page.cookies()
	for(let i in cookies) {
		await page.deleteCookie(cookies[i])
		// console.log(cookies[i])
	}
	// console.log(await page.cookies())
}
const vote = async (browser, character = 0) => {
	const page = await browser.newPage()
	// await page.setViewport({
	// 	width: 1200,
	// 	height: 1800
	// })
	const characters = ["https://sanriocharacterranking.com/characters/gudetama/?=vote", "https://sanriocharacterranking.com/characters/kirimichan/?=vote"]
	if(character >= characters.length) character = 0
	await page.goto(characters[character])
	await page.waitFor(1000)
	// try {
	// 	await stat("screenshots/")
	// } catch(err) {
	// 	await mkdir("screenshots/")
	// }
	// await page.screenshot({ path: "screenshots/1.png" })
	await page.click("#js-modalConfirm_vote")
	// await page.waitForNavigation("networkidle0")
	// await page.screenshot({ path: "screenshots/2.png" })
	const age = (Math.random() * 15 | 0) + 5
	const gender = 1
	const region = (Math.random() * 47 | 0) + 1
	console.log(age, gender, region)
	await page.waitFor(1500)
	await page.select("#userSelect-age", "" + age)
	await page.select("#userSelect-gender", "" + gender)
	await page.select("#userSelect-area", "" + region)
	await page.click(".mainContent_form_agree_checkLabel").catch(e => { console.log(e) })
	// await page.screenshot({ path: "screenshots/3.png" })
	await page.waitFor(1500)
	await page.click("#js-btnVote")
	// await page.screenshot({ path: "screenshots/4.png" })
	await page.waitFor(1500)
	await page.click("#js-modalConfirm_vote")
	await page.waitFor(2500)
	// await page.screenshot({ path: "screenshots/5.png" })
	// await page.waitForNavigation("networkidle0")
	await clearCookies(page)
	await page.evaluate(() => {
	    localStorage.clear()
	})
	await page.close()
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
const main = async () => {
	const browser = await puppeteer.launch({ headless: false })
	const loop = 2000
	for(let i = 0; i < loop; i++) {
		await vote(browser, i % 10).catch(err => {
			// await post(err)
		})
		console.log(`投票 ${ i + 1 }回`)
		// if(i % 50 === 0) {
		// 	await post(`投票 ${ i + 1 }回目`)
		// }
		// if(i !== loop - 1) await wait(1000)
	}
	browser.close()
}

main()
