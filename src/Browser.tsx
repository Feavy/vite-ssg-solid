import type { Component } from "solid-js";
import { MetaProvider } from "solid-meta";
import { App } from "./App";

const Browser: Component = () => {

  return (
    <MetaProvider>
      <App path={window.location.pathname}/>
    </MetaProvider>
  );
};

export default Browser;
