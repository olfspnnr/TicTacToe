import * as React from "react";
import * as ReactDOM from "react-dom";
import { position, Row, PlayArea } from "./playArea";

export interface replayProps {
  log: position[][][];
  return: () => any;
}

interface replayState {
  isLoaded: boolean;
}

interface displayBlockProps {
  playArea: position[][];
}

const DisplayBlock = (props: displayBlockProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Tahoma, Geneva, sans-serif",
        flexBasis: "33.33%"
      }}
    >
      <Row pos={1} posStates={props.playArea[0]} onClick={obj => console.log("")} />
      <Row pos={2} posStates={props.playArea[1]} onClick={obj => console.log("")} />
      <Row pos={3} posStates={props.playArea[2]} onClick={obj => console.log("")} />
    </div>
  );
};

export class Replay extends React.Component<replayProps, replayState> {
  constructor(replay_Props: replayProps) {
    super(replay_Props);
    this.state = {
      isLoaded: true
    };
  }

  componentDidMount() {}

  render() {
    let backRef: HTMLDivElement;
    return this.state ? (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Tahoma, Geneva, sans-serif",
          flexWrap: "wrap"
        }}
      >
        <div
          style={{
            width: "100%",
            height: "90%",
            display: "flex",
            flexDirection: "row",
            fontFamily: "Tahoma, Geneva, sans-serif",
            flexWrap: "wrap"
          }}
        >
          {this.props.log.map((playArea, index) => (
            <DisplayBlock key={index} playArea={playArea} />
          ))}
        </div>
        <div
          ref={ref => (backRef = ref)}
          style={{
            width: "100%",
            height: "10%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "Tahoma, Geneva, sans-serif",
            flexWrap: "wrap",
            backgroundColor: "lightblue",
            color: "white",
            fontSize: "0.8em",
            cursor: "pointer",
            transition: "all 0.1s"
          }}
          onMouseOver={() => (backRef.style.backgroundColor = "#8ecee2")}
          onMouseLeave={() => (backRef.style.backgroundColor = "lightblue")}
          onClick={() => {
            this.props.return();
          }}
        >
          Back
        </div>
      </div>
    ) : (
      <div>Loading...</div>
    );
  }
}
