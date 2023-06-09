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

		const pages = [];
		pages.push(["/", "index", {title: "Accueil"}]);
		pages.push(["/article", "article", {title: "Article"}]);
		pages.push(["/credits", "credits", {title: "Crédits"}]);
		pages.push(["/page2", "page2", {title: "Page2"}]);

		const render = require("./dist/server/entry-server.js").render
		await render("/"); // because for some reason lazy components are not loaded the first time

		for(const [path, file, data] of pages) {
			const html = await render(path, data);

			const appHtml = template
				.replace(`<!--app-head-->`, html.head + html.hydration)
				.replace(`<!--app-html-->`, html.body);

			// write app html to dist
			if(file === "index") {
				require("fs").writeFileSync(resolve(`dist/${file}.html`), appHtml);
			} else {
				require("fs").mkdirSync(resolve(`dist/${file}`));
				require("fs").writeFileSync(resolve(`dist/${file}/index.html`), appHtml);
			}
		}

		exit(0);

	} catch (e) {
		console.log(e.stack);
	}
})();
