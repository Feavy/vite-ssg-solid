import type { Component } from "solid-js";

interface PageProps {
    title: string;
}

const Page: Component<PageProps> = (props) => {
    return (<h1>PAGE : {props.title}</h1>);
};

export default Page;