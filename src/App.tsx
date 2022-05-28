import { Component, createSignal, lazy, Show } from "solid-js";
import { Title, Link } from "solid-meta";
import favicon from "../static/favicon.svg?url";
import LinkTo from "./router/Link";
import Route from "./router/Route";
import Router from "./router/Router";

const Index = lazy(() => import("./components/Index"));
const Article = lazy(() => import("./components/Article"));
const Credits = lazy(() => import("./components/Credits"));

interface AppProps {
	path: string;
}

export const App: Component<AppProps> = (props) => {
	const path = props.path;

	return (
		<Router path={path}>
			<Title>Solid.js & Vite - {path}</Title>
			<Link rel="shortcut icon" type="image/svg+xml" href={favicon} />
			<Link rel="stylesheet" href="/styles.css" />
			<nav>
				<LinkTo path="/" preload={Index}>Index</LinkTo>
				<br/>
				<LinkTo path="/article" preload={Article}>Article</LinkTo>
				<br/>
				<LinkTo path="/credits" preload={Credits}>Credits</LinkTo>
			</nav>
			<Route path="/" component={<Index />} />
			<Route path="/article" component={<Article />} />
			<Route path="/credits" component={<Credits />} />
		</Router>
	);
};

export default App;
