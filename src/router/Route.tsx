import { Component, JSX, Show } from "solid-js";
import { useRouter } from "./Router";

export interface RouteProps {
    path: string;
    component: JSX.Element;
}

const Route: Component<RouteProps> = (props) => {
    //@ts-ignore
    const [path] = useRouter();

    const path1 = props.path;

    return (
        <Show when={path1 === path()}>
            {props.component}
        </Show>
    )
};

export default Route;