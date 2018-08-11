import * as React from "react";
import * as ReactDOM from "react-dom";
import { PlayArea } from "./playArea";

export interface AppProps {}

interface AppState {
  playArea: string[];
}

export class App extends React.Component<AppProps, {}> {
  constructor(App_Props: AppProps) {
    super(App_Props);
  }

  render() {
    return <PlayArea />;
  }
}
