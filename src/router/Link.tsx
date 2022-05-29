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

const LinkTo: Component<ParentProps<LinkProps>> = (props) => {
    //@ts-ignore
    const [_, { setPath }] = useRouter();

    const navigate = (e: Event) => {
        e.preventDefault();
        window.history.pushState("", "", `${props.path}`);
        console.log("navigate to", props.path);
        if(isServer) {
            setPath(props.path);
        }else{
            (async () => {
                const body = await (fetch(props.path+".content.html").then(data => data.text()));
                document.body.innerHTML = body;
                const scriptElement = document.querySelector('script[type="module"]');
                console.log("currentScript : ",document.currentScript);
                console.log("scriptElement : ",scriptElement);
                const clone = scriptElement?.cloneNode(true);
                scriptElement?.remove();
                document.body.appendChild(clone!);
                console.log("updated script");
            })();
        }
    };

    const preload = (e: Event) => {
        if (!props.preload) {
            return;
        }
        props.preload.preload();
    };

    return (
        <a onMouseEnter={preload} onClick={navigate} href="#">{props.children}</a>
    );
};

export default LinkTo;