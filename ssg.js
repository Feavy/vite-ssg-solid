// @ts-check
// file deepcode ignore Utf8Literal: Web uses utf-8
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import * as path from "path";
import { exit } from "process";

import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const resolve = (p) => path.resolve(__dirname, p);

const indexProd = readFileSync(resolve("dist/index.html"), "utf-8");

import {render} from "./dist/server/entry-server.js";

(async () => {

	// deepcode ignore NoRateLimitingForExpensiveWebOperation: only used in dev
	try {
		const template = indexProd;

		const pages = [];
		pages.push(["/", "index", {title: "Accueil"}]);
		pages.push(["/article", "article", {title: "Article"}]);
		pages.push(["/credits", "credits", {title: "Crédits"}]);
		pages.push(["/page2", "page2", {title: "Page2"}]);

		for(const [path, file, data] of pages) {
			if(file !== "index") {
				mkdirSync(resolve(`dist/${file}`));
			}

			const html = await render(path, data);

			const appHtml = template
				.replace(`<!--app-head-->`, html.head + html.hydration)
				.replace(`<!--app-html-->`, suppressHydrationOverhead(html.body));

			// write app html to dist
			if(file === "index") {
				writeFileSync(resolve(`dist/${file}.html`), appHtml);
			} else {
				writeFileSync(resolve(`dist/${file}/index.html`), appHtml);
			}
		}

		exit(0);

	} catch (e) {
		console.log(e.stack);
	}
})();

function suppressHydrationOverhead(app) {
	const lines = app.split("\n");
	let lastLine = lines.pop();
	lastLine = lastLine.split("<script>")[0];
	lines.push(lastLine);
	return lines.join("\n");
}
