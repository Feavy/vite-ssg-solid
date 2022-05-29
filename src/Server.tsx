import type { Component } from "solid-js";
import { MetaProvider } from "solid-meta";
import { App } from "./App";

export interface TagDescription {
  tag: string;
  props: Record<string, unknown>;
}

export interface ServerProps {
  tags: TagDescription[];
  path: string;
  data: any;
}

const Server: Component<ServerProps> = (props) => {
  return (
    <MetaProvider tags={props.tags}>
      <App path={props.path} data={props.data}/>
    </MetaProvider>
  );
};

export default Server;
