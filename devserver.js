// file deepcode ignore Utf8Literal: Web uses utf-8
const { readFileSync } = require("fs");
const path = require("path");
const express = require("express");

const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;
const PORT = process.env.PORT || "3000";

async function createServer(
	root = process.cwd(),
	isProd = process.env.NODE_ENV === "production"
) {
	const resolve = (p) => path.resolve(__dirname, p);

	const app = express().disable("x-powered-by");

	let vite;

	if (!isProd) {
		vite = await require("vite").createServer({
			root,
			logLevel: isTest ? "error" : "info",
			server: {
				middlewareMode: true,
			},
		});
		// use vite's connect instance as middleware
		app.use(vite.middlewares);
	} else {
		app.use(require("compression"));
		app.use(
			require("serve-static")(resolve("dist/client"), {
				index: false,
			})
		);
	}

	// deepcode ignore NoRateLimitingForExpensiveWebOperation: only used in dev
	app.use("*", async (req, res) => {
		try {
			const url = req.originalUrl;

			const template = await vite.transformIndexHtml(
								url,
								readFileSync(resolve("index.html"), "utf-8")
				  			);

			const render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;

			const html = render(url);

			const appHtml = template
				.replace(`<!--app-head-->`, html.head + html.hydration)
				.replace(`<!--app-html-->`, html.body);

			// deepcode ignore XSS: url only used to render page, deepcode ignore ServerLeak: Doesn't happen here
			res.status(200).set({ "Content-Type": "text/html" }).end(appHtml);
		} catch (e) {
			vite && vite.ssrFixStacktrace(e);
			console.log(e.stack);
			
			// deepcode ignore XSS: url only used in dev, deepcode ignore ServerLeak: not done in prod
			res.status(500).end(e.stack);
		}
	});

	return { app, vite };
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
exports.createServer = createServer;
