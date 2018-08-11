import * as React from "react";
import * as ReactDOM from "react-dom";
import { Replay } from "./replay";

export interface PlayAreaProps {}

interface PlayAreaState {
  currentPlayer: string;
  playArea: position[][];
  log: position[][][];
  isWon: boolean;
  winner: string;
  showReplay: boolean;
}

interface row extends position {
  row: number;
}

export interface position {
  pos?: number;
  clicked: boolean;
  clickedBy: string | undefined;
}

interface RowProps {
  pos: number;
  posStates: position[];
  onClick: (obj: row) => any;
}

interface ButtonProps {
  onClick: (obj: position) => any;
  position: position;
  pos: number;
}

const Button = (props: ButtonProps) => {
  let eleRef: HTMLDivElement;
  return (
    <div
      ref={ref => (eleRef = ref)}
      style={{
        width: "8vh",
        height: "8vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "5vh",
        margin: "1px",
        backgroundColor: "whitesmoke",
        boxShadow: "3px 3px 5px 0px rgba(0,0,0,0.24)",
        color: "#232b2b",
        transition: "all 0.25s"
      }}
      onMouseOver={() => (eleRef.style.backgroundColor = "white")}
      onMouseLeave={() => (eleRef.style.backgroundColor = "whitesmoke")}
      onClick={() => {
        if (!props.position.clicked) props.onClick({ pos: props.pos, ...props.position });
      }}
    >
      <span>{props.position.clicked ? props.position.clickedBy : ""}</span>
    </div>
  );
};

export const Row = (props: RowProps) => {
  return (
    <div style={{ display: "flex" }}>
      <Button position={props.posStates[0]} pos={1} onClick={obj => props.onClick({ row: props.pos, ...obj })} />
      <Button position={props.posStates[1]} pos={2} onClick={obj => props.onClick({ row: props.pos, ...obj })} />
      <Button position={props.posStates[2]} pos={3} onClick={obj => props.onClick({ row: props.pos, ...obj })} />
    </div>
  );
};

export class PlayArea extends React.Component<PlayAreaProps, PlayAreaState> {
  constructor(PlayArea_Props: PlayAreaProps) {
    super(PlayArea_Props);
    this.state = {
      isWon: false,
      winner: "",
      currentPlayer: "X",
      playArea: this.getCleanPlayField(),
      log: undefined,
      showReplay: false
    };
  }

  componentDidMount() {
    console.log(this.state);
  }

  private getCleanPlayField = () =>
    [
      [
        { clicked: false, clickedBy: undefined },
        { clicked: false, clickedBy: undefined },
        { clicked: false, clickedBy: undefined }
      ],
      [
        { clicked: false, clickedBy: undefined },
        { clicked: false, clickedBy: undefined },
        { clicked: false, clickedBy: undefined }
      ],
      [
        { clicked: false, clickedBy: undefined },
        { clicked: false, clickedBy: undefined },
        { clicked: false, clickedBy: undefined }
      ]
    ] as position[][];

  private copyPlay = (play: position[][]) => {
    let playCopy: position[][] = [];
    play.forEach((row, index) => {
      playCopy.push([]);
      row.forEach(move => {
        playCopy[index].push({ clicked: move.clicked, clickedBy: move.clickedBy, pos: move.pos || 0 });
      });
    });
    return playCopy;
  };

  private handleAreaClick(click: row) {
    let currentArea = this.state.playArea;
    currentArea[click.row - 1][click.pos - 1] = { clicked: true, clickedBy: this.state.currentPlayer };
    this.setState(
      {
        playArea: currentArea,
        currentPlayer: this.state.currentPlayer === "X" ? "O" : "X"
      },
      () => {
        let currentLog: position[][][] = this.state.log || [];
        currentLog.push([...this.copyPlay(this.state.playArea)]);
        this.setState(
          {
            log: currentLog
          },
          () => {
            this.checkForWinner();
            console.log(this.state);
          }
        );
      }
    );
  }

  private checkForWinner = () => {
    let currentArea = this.state.playArea;

    const letWin = (winner: string) => {
      this.setState({
        isWon: true,
        winner: winner
      });
    };
    let currentClicker: string | undefined = undefined;
    let clickedInRow = 0;
    currentArea.forEach(row => {
      clickedInRow = 0;
      row.forEach(button => {
        if (button.clicked) {
          if (currentClicker === undefined) {
            currentClicker = button.clickedBy;
            clickedInRow = 1;
          } else {
            if (currentClicker === button.clickedBy) {
              clickedInRow += 1;
            }
          }
        }
      });
      if (clickedInRow != 3) {
        for (let i = 0; i < 3; i++) {
          currentClicker = undefined;
          clickedInRow = 0;
          for (let j = 0; j < 3; j++) {
            if (currentArea[j][i].clicked) {
              if (currentClicker == undefined) {
                currentClicker = currentArea[j][i].clickedBy;
                clickedInRow = 1;
              } else if (currentClicker == currentArea[j][i].clickedBy) {
                clickedInRow += 1;
                if (clickedInRow === 3) {
                  return letWin(currentClicker);
                }
              }
            }
          }
        }
      }
      if (clickedInRow === 3) {
        return letWin(currentClicker);
      }
    });

    if (
      currentArea[0][0].clicked &&
      currentArea[1][1].clicked &&
      currentArea[2][2].clicked &&
      (currentArea[0][0].clickedBy == currentArea[1][1].clickedBy &&
        currentArea[0][0].clickedBy == currentArea[2][2].clickedBy)
    ) {
      letWin(currentArea[0][0].clickedBy);
    } else if (
      currentArea[0][2].clicked &&
      currentArea[1][1].clicked &&
      currentArea[2][0].clicked &&
      (currentArea[0][2].clickedBy == currentArea[1][1].clickedBy &&
        currentArea[0][2].clickedBy == currentArea[2][0].clickedBy)
    ) {
      letWin(currentArea[0][2].clickedBy);
    }

    let completedRows: number = 0;
    currentArea.forEach(row => {
      let clicked: number = 0;
      row.forEach(button => {
        if (button.clicked) clicked++;
        if (clicked === 3) completedRows++;
      });
      if (completedRows == 3) letWin("DRAW");
    });
  };

  render() {
    let nextgameRef: HTMLSpanElement;
    let showreplayRef: HTMLSpanElement;
    return this.state ? (
      !this.state.isWon && !this.state.showReplay ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "Tahoma, Geneva, sans-serif"
          }}
        >
          <h5 style={{ fontWeight: 200, letterSpacing: "2px" }}>
            Current Player: <b>{this.state.currentPlayer}</b>
          </h5>
          <Row pos={1} posStates={this.state.playArea[0]} onClick={obj => this.handleAreaClick(obj)} />
          <Row pos={2} posStates={this.state.playArea[1]} onClick={obj => this.handleAreaClick(obj)} />
          <Row pos={3} posStates={this.state.playArea[2]} onClick={obj => this.handleAreaClick(obj)} />
        </div>
      ) : this.state.isWon && !this.state.showReplay ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "Tahoma, Geneva, sans-serif"
          }}
        >
          <h5 style={{ fontWeight: 200, letterSpacing: "2px" }}>
            Winner: <b>{this.state.winner} </b>
          </h5>
          <span
            ref={ref => (nextgameRef = ref)}
            style={{
              cursor: "pointer",
              color: "white",
              height: "3em",
              width: "7em",
              backgroundColor: "lightblue",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "0.8em",
              margin: "2px",
              padding: 0,
              transition: "all 0.1s"
            }}
            onMouseOver={() => (nextgameRef.style.backgroundColor = "#8ecee2")}
            onMouseLeave={() => (nextgameRef.style.backgroundColor = "lightblue")}
            onClick={() => {
              this.setState({
                playArea: this.getCleanPlayField(),
                isWon: false,
                currentPlayer: "X",
                winner: undefined,
                log: undefined
              });
            }}
          >
            Next Game
          </span>
          <span
            ref={ref => (showreplayRef = ref)}
            style={{
              cursor: "pointer",
              color: "white",
              height: "3em",
              width: "7em",
              backgroundColor: "lightblue",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "0.8em",
              margin: 0,
              padding: 0,
              transition: "all 0.1s"
            }}
            onMouseOver={() => (showreplayRef.style.backgroundColor = "#8ecee2")}
            onMouseLeave={() => (showreplayRef.style.backgroundColor = "lightblue")}
            onClick={() => {
              this.setState({
                showReplay: true
              });
            }}
          >
            Show Replay
          </span>
        </div>
      ) : (
        <Replay log={this.state.log} return={() => this.setState({ showReplay: false })} />
      )
    ) : (
      <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        Loading...
      </div>
    );
  }
}
