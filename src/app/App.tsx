import {Component, lazy, Suspense} from "solid-js";
import { Title, Link } from "solid-meta";
import styles from "../assets/styles.css?url";
import LinkTo from "./router/Link";
import Route from "./router/Route";
import Router from "./router/Router";

const Page = lazy(() => import("./components/Page"));
const Page2 = lazy(() => import("./components/Page2"));

interface AppProps {
	path: string;
	data: any;
}

export const App: Component<AppProps> = (props) => {
	const path = props.path;
	console.log(path);

	return (
		<Router path={path}>
			<Title>Solid.js & Vite - {path}</Title>
			<Link rel="shortcut icon" type="image/svg+xml" href="/static/favicon.svg" />
			<Link rel="stylesheet" href={styles} />
			<nav>
				<LinkTo path="/" preload={Page}>Index</LinkTo>
				<br/>
				<LinkTo path="/article" preload={Page}>Article</LinkTo>
				<br/>
				<LinkTo path="/credits" preload={Page}>Credits</LinkTo>
				<br/>
				<LinkTo path="/page2" preload={Page2}>Page2</LinkTo>
			</nav>
			<Suspense
				fallback={
					<span class="loader" style="opacity: 0">
                    Loading...
                  </span>
				}
			>
				<Route path="/" component={<Page title={"Accueil"} />} />
				<Route path="/article" component={<Page title={"Article"} />} />
				<Route path="/credits" component={<Page title={"Credits"} />} />
				<Route path="/page2" component={<Page2 title={"Page2"} />} />
			</Suspense>
		</Router>
	);
};

export default App;
