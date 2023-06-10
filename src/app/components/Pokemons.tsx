import type {Component, Resource} from "solid-js";
import {createResource} from "solid-js";

interface PokemonData {
	count: number;
	results: {
		name: string;
		url: string;
	}[];
}


interface PageProps {
	title: string;
}

let serverCallCount = 0;
let succeededServerCallCount = 0;
let pageDataCache: any[] = [];
let mutates = [];

function server<T>(callback: () => Promise<T>): Resource<T> {
	let callIndex = serverCallCount++;
	const [res] = createResource((async () => {
		let data: T = null;
		if (import.meta.env.SSR) {
			// Either call callback to fetch data (generation time)
			data = await callback();
			succeededServerCallCount++;
			pageDataCache[callIndex] = data;

			if(serverCallCount === succeededServerCallCount) {
				const fs = await import("fs/promises");
				try {
					console.log("Create file")
					// await fs.mkdir("dist/page2", {recursive: true})
					await fs.writeFile("dist/page2/page_data.json", JSON.stringify(pageDataCache));
					console.log("Created file")
				} catch (e) {
					console.log(e)
				}
			}
		} else {
			// Or fetch data generated earlier (runtime)
			if(pageDataCache.length == 0) {
				pageDataCache = await fetch("/page2/page_data.json").then((res) => res.json());
			}
			callIndex %= pageDataCache.length;
			data = pageDataCache[callIndex];
		}
		return data;
	}));
	return res;
}

const Page: Component<PageProps> = (props) => {
	const pokemons = server(async () => {
		return (await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0')).json();
	})

	const joke = server(async () => {
		return (await fetch('https://v2.jokeapi.dev/joke/Programming')).json();
	});

	return (
		<div>
			<div>
				<pre>{JSON.stringify(pokemons(), null, 2)}</pre>
			</div>
			<div>
				<pre>{JSON.stringify(joke(), null, 2)}</pre>
			</div>
			{/*{data.results && (*/}
			{/*	<>*/}
			{/*		<h1>{data.count} Pokémons</h1>*/}
			{/*		<ul>*/}
			{/*			{data.results.map((pokemon) => (*/}
			{/*				<li>*/}
			{/*					{pokemon.name}*/}
			{/*				</li>*/}
			{/*			))}*/}
			{/*		</ul>*/}
			{/*	</>*/}
			{/*)}*/}
		</div>
	)
};

export default Page;
