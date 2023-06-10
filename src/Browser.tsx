import type { Component } from "solid-js";
import { MetaProvider } from "solid-meta";
import { App } from "./app/App";

const Browser: Component = () => {

  return (
    <MetaProvider>
      <App path={window.location.pathname} data={{title: "undefined"}}/>
    </MetaProvider>
  );
};

export default Browser;
