import type {Component, Resource, Setter} from "solid-js";
import {createResource, Show, Suspense} from "solid-js";

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
let expectedSuccessCount = 0;

function server<T>(callback: () => Promise<T>): [Resource<T>, Setter<T | undefined>] {
	let callIndex = serverCallCount++;
	console.log("server")
	const [res, {mutate}] = createResource((async () => {
		let data: T = null;
		if (import.meta.env.SSR) {
			// Either call callback to fetch data (generation time)
			data = await callback();
			if(expectedSuccessCount === 0) {
				expectedSuccessCount = serverCallCount;
			}
			succeededServerCallCount++;
			pageDataCache[callIndex] = data;

			if(expectedSuccessCount === succeededServerCallCount) {
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
			if (pageDataCache.length == 0) {
				pageDataCache = await fetch("/page2/page_data.json").then((res) => res.json());
			}
			callIndex %= pageDataCache.length;
			data = pageDataCache[callIndex];
		}
		return data;
	}));
	return [res, mutate];
}

function shuffle<T>(array: T[]): T[] {
	array = [...array];
	let currentIndex = array.length, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		//@ts-ignore
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
	return array;
}

const Page: Component<PageProps> = (props) => {
	const [pokemons, setPokemons] = server<PokemonData["results"]>(async () => {
		return (await (fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0')).then((res) => res.json())).results;
	});

	const [joke] = server<string>(async () => {
		let joke = (await (fetch('https://v2.jokeapi.dev/joke/Programming')).then((res) => res.json()));
		joke = joke.joke || joke.setup + "\n" + joke.delivery;
		return joke;
	});

	function shuffleList(e) {
		setPokemons(shuffle(pokemons()!!));
	}

	return (
		<div>
			<h1>PAGE</h1>
			<Suspense fallback={<h1>Loading...</h1>}>
				<h1>{joke()}</h1>
			</Suspense>
			<Suspense fallback={<h1>Loading...</h1>}>
				<h1>{pokemons()?.length} Pokémons</h1>
				<button onclick={shuffleList}>shuffle</button>
				<ul>
					{pokemons()?.map((pokemon) => (
						<li>
							{pokemon.name}
						</li>
					))}
				</ul>
			</Suspense>
		</div>
	)
};

export default Page;
