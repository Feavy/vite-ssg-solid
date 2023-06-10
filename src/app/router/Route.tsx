import {Component, JSX, Show} from "solid-js";
import {useRouter} from "./Router";

export interface RouteProps {
	path: string;
	component: JSX.Element;
}

function matches(path: string, route: string) {
	if (path.length > 1 && path.endsWith("/")) {
		path = path.slice(0, -1);
	}
	return path === route;
}

const Route: Component<RouteProps> = (props) => {
	//@ts-ignore
	const [path] = useRouter();

	return (
		<Show when={matches(path(), props.path)}>
			{props.component}
		</Show>
	)
};

export default Route;
