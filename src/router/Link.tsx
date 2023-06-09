import type { Component, ParentProps } from "solid-js";
import { isServer } from "solid-js/web";
import { useRouter } from "./Router";

export interface LinkProps {
    path: string;
    preload?: {
        preload: () => Promise<{
            default: Component<any>;
        }>
    };
}

const Link = props => {
	//@ts-ignore
	const [_, { setPath }] = useRouter();
	const navigate = e => {
		if (e) e.preventDefault();
		window.history.pushState("", "", `${props.path}`);
		setPath(props.path);
	};

	const preload = (e: Event) => {
		if (!props.preload) {
			return;
		}
		props.preload.preload();
	};

	return (
		<a onMouseEnter={preload} class="link" href={`${props.path}`} onClick={navigate}>
			{props.children}
		</a>
	);
};


export default Link;
