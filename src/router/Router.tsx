import { Component, createContext, createEffect, createSignal, JSX, ParentProps, PropsWithChildren, useContext } from "solid-js";
import { isServer } from "solid-js/web";

const RouterContext = createContext();

interface RouterProps {
    path: string;
}

const Router: Component<ParentProps<RouterProps>> = (props) => {
    const [path, setPath] = createSignal(props.path),
    store = [path, {setPath: (path: string) => setPath(path)}];

    !isServer && (window.onpopstate = () => setPath(window.location.pathname));

    createEffect(() => {
        setPath(props.path);
    }, props.path);
    
    return (
        <RouterContext.Provider value={store}>
            {props.children}
        </RouterContext.Provider>
    )
};

export default Router;

export function useRouter() { return useContext(RouterContext); }