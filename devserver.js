// file deepcode ignore Utf8Literal: Web uses utf-8
import { readFileSync } from "fs";
import * as path from "path";
import express from "express";
import * as vite from "vite";

import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;
const PORT = process.env.PORT || "3000";

async function createServer(
	root = process.cwd(),
	isProd = process.env.NODE_ENV === "production"
) {
	const resolve = (p) => path.resolve(__dirname, p);

	const app = express().disable("x-powered-by");

	let viteServer;

	if (!isProd) {
			viteServer = await vite.createServer({
				root,
				logLevel: isTest ? "error" : "info",
				server: {
					middlewareMode: true,
				},
				appType: "custom"
			});
			app.use(viteServer.middlewares);
			// use vite's connect instance as middleware
	} else {
		app.use(require("compression"));
		app.use(
			require("serve-static")(resolve("dist/client"), {
				index: false,
			})
		);
	}

	const render = (await viteServer.ssrLoadModule("/src/entry-server.tsx")).render;

	// deepcode ignore NoRateLimitingForExpensiveWebOperation: only used in dev
	app.use("*", async (req, res) => {
		try {
			const url = req.originalUrl;
			if(url.endsWith("page_data.json")) {
				const content = readFileSync("./dist"+url, "utf-8")
				res.status(200).set({ "Content-Type": "application/json" }).end(content);
				return;
			}

			const template = await viteServer.transformIndexHtml(
								url,
								readFileSync(resolve("index.html"), "utf-8")
				  			);

			const html = await render(url);

			const appHtml = template
				.replace(`<!--app-head-->`, html.head + html.hydration)
				.replace(`<!--app-html-->`, html.body);

			// deepcode ignore XSS: url only used to render page, deepcode ignore ServerLeak: Doesn't happen here
			res.status(200).set({ "Content-Type": "text/html" }).end(appHtml);
		} catch (e) {
			viteServer && viteServer.ssrFixStacktrace(e);
			console.log(e.stack);

			// deepcode ignore XSS: url only used in dev, deepcode ignore ServerLeak: not done in prod
			res.status(500).end(e.stack);
		}
	});

	return { app, viteServer };
}

if (!isTest) {
	createServer()
		.then(({ app }) =>
			app.listen(PORT, () => {
				console.log(`http://localhost:${PORT}`);
			})
		)
		.catch((err) => {
			console.error("Error Starting Server:\n", err);
			process.exit(1);
		});
}

// for test use
export { createServer };
