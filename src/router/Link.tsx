import type { Component, ParentProps } from "solid-js";
import { useRouter } from "./Router";

export interface LinkProps {
    path: string;
    preload?: {
        preload: () => Promise<{
            default: Component<{}>;
        }>
    };
}

const LinkTo: Component<ParentProps<LinkProps>> = (props) => {
    //@ts-ignore
    const [_, { setPath }] = useRouter();

    const navigate = (e: Event) => {
        e.preventDefault();
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
        <a onMouseEnter={preload} onClick={navigate} href="#">{props.children}</a>
    )
};

export default LinkTo;