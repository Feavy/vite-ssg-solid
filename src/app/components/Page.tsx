import type { Component } from "solid-js";
import {createSignal} from "solid-js";

interface PageProps {
    title: string;
}

const Page: Component<PageProps> = (props) => {
		const [count, setCount] = createSignal(0);
		const increment = () => setCount(count() + 1);
		setInterval(increment, 100);

    return (
			<div>
				<h1>PAGE : {props.title}</h1>
				<p>Count: {count()}</p>
			</div>
		);
};

export default Page;
