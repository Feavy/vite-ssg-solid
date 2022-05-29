import { Component, createSignal, lazy, Show } from "solid-js";
import { Title, Link } from "solid-meta";
import favicon from "../static/favicon.svg?url";
import LinkTo from "./router/Link";
import Route from "./router/Route";
import Router from "./router/Router";

const Page = lazy(() => import("./components/Page"));

interface AppProps {
	path: string;
	data: any;
}

export const App: Component<AppProps> = (props) => {
	const path = props.path;

	return (
		<Router path={path}>
			<Title>Solid.js & Vite - {path}</Title>
			<Link rel="shortcut icon" type="image/svg+xml" href={favicon} />
			<Link rel="stylesheet" href="/styles.css" />
			<nav>
				<LinkTo path="/" preload={Page}>Index</LinkTo>
				<br/>
				<LinkTo path="/article" preload={Page}>Article</LinkTo>
				<br/>
				<LinkTo path="/credits" preload={Page}>Credits</LinkTo>
			</nav>
			<Route path="/" component={<Page title={props.data.title} />} />
			<Route path="/article" component={<Page title={props.data.title} />} />
			<Route path="/credits" component={<Page title={props.data.title} />} />
		</Router>
	);
};

export default App;
