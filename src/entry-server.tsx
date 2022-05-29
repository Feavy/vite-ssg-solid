import { generateHydrationScript, renderToStringAsync } from "solid-js/web";
import { renderTags } from "solid-meta";
import Server, { TagDescription } from "./Server";

export async function render(path: string, data: any) {
  let tags: TagDescription[] = [];
  const body = await renderToStringAsync(() => <Server tags={tags} path={path} data={data} />);
  const hydration = generateHydrationScript();
  const head = renderTags(tags);
  return {
    head,
    hydration,
    body,
  };
}
