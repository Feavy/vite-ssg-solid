// @ts-check
// file deepcode ignore Utf8Literal: Web uses utf-8
const { readFileSync } = require("fs");
const path = require("path");

const resolve = (p) => path.resolve(__dirname, p);

const indexProd = readFileSync(resolve("dist/index.html"), "utf-8");


(async () => {
	let vite = await require("vite").createServer({
		root: process.cwd(),
		logLevel: "info",
		server: {
			middlewareMode: true,
		},
	});

	// deepcode ignore NoRateLimitingForExpensiveWebOperation: only used in dev
	try {
		/**
		 * always read the fresh template in dev
		 * @type {string}
		 */
		const template = indexProd;
			// ? 
			// : await vite.transformIndexHtml(
			// 	"index.html",
			// 	readFileSync(resolve("index.html"), "utf-8")
			// );

		const render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render; // require("./dist/server/entry-server.js").render

		const html = render("index.html");

		const appHtml = template
			.replace(`<!--app-head-->`, html.head + html.hydration)
			.replace(`<!--app-html-->`, html.body);

		vite.close();

		// write app html to dist
		require("fs").writeFileSync(resolve("dist/index.html"), appHtml);

		// deepcode ignore XSS: url only used to render page, deepcode ignore ServerLeak: Doesn't happen here
	} catch (e) {
		vite && vite.ssrFixStacktrace(e);
		console.log(e.stack);
	}
})();