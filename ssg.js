// @ts-check
// file deepcode ignore Utf8Literal: Web uses utf-8
const { readFileSync } = require("fs");
const path = require("path");
const { exit } = require("process");

const resolve = (p) => path.resolve(__dirname, p);

const indexProd = readFileSync(resolve("dist/index.html"), "utf-8");

(async () => {

	// deepcode ignore NoRateLimitingForExpensiveWebOperation: only used in dev
	try {
		const template = indexProd;

		const pages = new Map();
		pages.set("/", "index.html");
		pages.set("/article", "article.html");
		pages.set("/credits", "credits.html");

		const render = require("./dist/server/entry-server.js").render
		await render("/"); // because for some reason lazy components are not loaded the first time

		for(const [path, file] of pages) {
			const html = await render(path);

			const appHtml = template
				.replace(`<!--app-head-->`, html.head + html.hydration)
				.replace(`<!--app-html-->`, html.body);

			// write app html to dist
			require("fs").writeFileSync(resolve(`dist/${file}`), appHtml);
		}

		exit(0);

	} catch (e) {
		console.log(e.stack);
	}
})();