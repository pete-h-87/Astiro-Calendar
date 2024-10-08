import React, { useState, useEffect } from "react";

const defaultData = [
  {
    ID: 1,
    Start: 8.0,
    End: 9.5,
    Text: "Bandak: Service on machine",
    Status: "T",
  },
  {
    ID: 2,
    Start: 9.5,
    End: 11.5,
    Text: "Bandak: Service on machine",
    Status: "W",
  },
  {
    ID: 3,
    Start: 12.0,
    End: 15.0,
    Text: "Bandak: Adjustment of gantry",
    Status: "W",
  },
  {
    ID: 4,
    Start: 15.0,
    End: 16.0,
    Text: "Bandak: Adjustment of gantry",
    Status: "T",
  },
];

const startTimeRef = React.createRef();
//const endTimeRef = React.createRef()
const mouseMoveMode = React.createRef("");
const mouseDownXPos = React.createRef(0);
const cursorElementRef = React.createRef();
//canvasRef? - to get the time when over rendered divs

export default function Slider6(props) {
  const [time, setTime] = useState();
  const [selectedItem, setSelectedItem] = useState(null);
  const [datasource, setDatasource] = useState(defaultData);
  const [cursor, setCursor] = useState("w-resize");

  function decimalToXpoint(hourDecimal) {
    let posFactor = hourDecimal / 24;
    let posX = 510 * posFactor;
    posX += 100;
    return posX;
  }

  function xPosToHourDecimal(e) {
    let relativePos = e.clientX - e.target.offsetLeft;
    let totalWidth = e.target.offsetWidth;
    let positionFactor = relativePos / totalWidth;
    let hoursDecimal = 24 * positionFactor;
    return hoursDecimal;
  }

  function canvasMouseMove(e) {
    let relativePos = e.clientX - e.target.offsetLeft;
    let totalWidth = e.target.offsetWidth;
    let positionFactor = relativePos / totalWidth;
    let hoursDecimal = 24 * positionFactor;
    let hours = Math.floor(hoursDecimal);
    let minutes = hoursDecimal - hours;
    minutes = minutes * 60;
    minutes = Math.round(minutes / 5) * 5;
    setTime(pad(hours, 2) + ":" + pad(minutes, 2));

    if (mouseMoveMode.current === "newItemEnd") {
      let end = xPosToHourDecimal(e);
      //let updatedItem = {...selectedItem, End:end}
      let newState = [...datasource];
      let changedItem = newState.find((item) => item.ID === selectedItem.ID);
      changedItem.End = end;
      setDatasource(newState);
    } else if (mouseMoveMode.current === "itemMove") {
      handleItemMove(e);
    }
  }

  function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
  }

  // useEffect(
  //   (e) => {
  //     if (selectedItem && mouseMoveMode.current === "edgeMove") {
  //       handleSpanAdjust(e);
  //     }
  //   },
  //   [selectedItem]
  // );

  function timespanMouseDown(e) {
    let clickedItemData = e.currentTarget.dataset["id"];
    if (
      clickedItemData &&
      cursorElementRef.current.cursor !== "cursor-col-resize"
    ) {
      let id = Number(clickedItemData);
      let item = datasource.find((element) => element.ID === id);
      setSelectedItem(item);
      mouseMoveMode.current = "itemMove"; //add logic - is it at start? at end?
      mouseDownXPos.current = e.clientX;
      // document.body.classList.add("loading");

      // let element = document.getElementById(clickedItemData.ID)
      // if (element) {
      //   element.classList.add("cursor-w-resize")
      // }
    } else if (
      clickedItemData &&
      cursorElementRef.current.cursor === "cursor-col-resize"
    ) {
      let id = Number(clickedItemData);
      let item = datasource.find((element) => element.ID === id);
      setSelectedItem(item);
      mouseMoveMode.current = "edgeMove"; //add logic - is it at start? at end?
      mouseDownXPos.current = e.clientX;
      handleSpanAdjust(e);
      // console.log("yoamamama")
    }
  }

  // the click should only handle the state of the selected item
  // to get other info on the condition of the locatio of the cursor, use

  function handleSpanAdjust(e) {
    if ((mouseMoveMode.current = "edgeMove")) {
      let nowPosX = e.clientX;
      let distancePoints = nowPosX - mouseDownXPos.current;
      // if (Math.abs(distancePoints) < 10) return;
      let timeMovedFactor = distancePoints / 510;
      let timeMovedHours = timeMovedFactor * 24;
      let newState = [...datasource];
      let changedItem = newState.find((item) => item.ID === selectedItem.ID);
      // let newStart = changedItem.Start + Math.round(timeMovedHours * 4) / 4;
      let newEnd = changedItem.End + Math.round(timeMovedHours * 4) / 4;
      // changedItem.Start = newStart; //if moveEnd, moveStart...
      changedItem.End = newEnd;
      // mouseDownXPos.current = e.clientX;
      setDatasource(newState);
      console.log(newState);
    }
  }

  function canvasMouseDown(e) {
    startTimeRef.current = xPosToHourDecimal(e);
    //addNewData
    let newState = [...datasource];
    let newItem = {
      ID: datasource.length + 1,
      Start: startTimeRef.current,
      end: startTimeRef.current,
      Text: "",
      Status: "",
    };
    newState.push(newItem);
    setDatasource(newState);
    setSelectedItem(newItem);
    mouseMoveMode.current = "newItemEnd";
  }

  function canvasMouseUp(e) {
    mouseMoveMode.current = "";
    removeMoveCursor();
    setSelectedItem(null);
  }

  function removeMoveCursor() {
    if (cursorElementRef.current) {
      cursorElementRef.current.element.classList.remove(
        cursorElementRef.current.cursor
      );
    }
  }

  function handleItemMove(e) {
    let nowPosX = e.clientX;
    let distancePoints = nowPosX - mouseDownXPos.current;
    if (Math.abs(distancePoints) < 10) return;
    let timeMovedFactor = distancePoints / 510;
    let timeMovedHours = timeMovedFactor * 24;
    let newState = [...datasource];
    let changedItem = newState.find((item) => item.ID === selectedItem.ID);
    let newStart = changedItem.Start + Math.round(timeMovedHours * 4) / 4;
    let newEnd = changedItem.End + Math.round(timeMovedHours * 4) / 4;
    if (
      distancePoints > 0 &&
      cursorElementRef.current.cursor !== "cursor-col-resize"
    ) {
      //if distancePoints>0 && moveMode === ....
      newEnd = getOverlapBorder(newEnd, true);
      newStart = changedItem.Start + (newEnd - changedItem.End);
    }
    // else if (distancePoints > 0 && cursorElementRef.current.cursor === "cursor-col-resize") {
    //   newEnd = getOverlapBorder(newEnd, true);
    // }
    else {
      newStart = getOverlapBorder(newStart, false);
      newEnd = changedItem.End + (newStart - changedItem.Start);
    }

    changedItem.Start = newStart; //if moveEnd, moveStart...
    changedItem.End = newEnd;
    mouseDownXPos.current = e.clientX;
    setDatasource(newState);
  }

  function getOverlapBorder(newTime, directionUp) {
    for (let index = 0; index < datasource.length; index++) {
      const element = datasource[index];
      if (element.ID != selectedItem.ID) {
        if (newTime > element.Start && newTime < element.End)
          return directionUp ? element.Start : element.End;
      }
    }

    return newTime;
  }

  function timespanMouseMove(e) {
    if (selectedItem && mouseMoveMode.current !== "itemMove") {
      handleItemMove(e);
    }
    let cursorClass = "cursor-w-resize";
    if (
      e.clientX < e.target.offsetLeft + e.target.offsetWidth * 0.2 || // start of element
      e.clientX > e.target.offsetLeft + e.target.offsetWidth * 0.8
    ) {
      // end of element
      cursorClass = "cursor-col-resize";
    }
    removeMoveCursor();
    cursorElementRef.current = {
      cursor: cursorClass,
      element: e.currentTarget,
    };
    e.currentTarget.classList.add(cursorClass);
  }

  return (
    <div>
      {/* <div style={{ cursor: 'pointer' }}>Click</div> */}
      <div style={{ margin: "100px 0 0 100px" }}>
        00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23
      </div>
      <div
        style={{
          width: "510px",
          height: "50px",
          backgroundColor: "lightblue",
          margin: "5px 0 0 100px",
          border: "1px solid black",
        }}
        id="canvas"
        onMouseMove={canvasMouseMove}
        onMouseDown={canvasMouseDown}
        onMouseUp={canvasMouseUp}
      />

      {datasource.map((item) => (
        <div
          //className='cursor-w-resize'
          key={item.ID}
          data-id={item.ID}
          style={{
            position: "absolute",
            left: decimalToXpoint(item.Start),
            top: "130px",
            width: decimalToXpoint(item.End) - decimalToXpoint(item.Start),
            height: "40px",
            backgroundColor: item.Status == "W" ? "red" : "blue",
            border:
              selectedItem && selectedItem.ID === item.ID
                ? "2px solid yellow"
                : "1px solid black",
            borderRadius: "5px",
            // cursor: {cursor}
          }}
          title={item.Text}
          onMouseDown={timespanMouseDown}
          onMouseUp={canvasMouseUp}
          onMouseMove={timespanMouseMove}
        ></div>
      ))}

      {/* <div style={{position:'absolute', left:'100px', top: '130px', width: '510px', height:'40px', backgroundColor: 'red'}} title='03:45 - 12:30 - Customer: Brødrene Jacobsen: ' ></div> */}

      <div>Time={time}</div>
      <div>SelectedData:{JSON.stringify(selectedItem)}</div>
    </div>
  );
}

function doStuff() {
  console.log("hello");
}

doStuff();

/*

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

.cursor-w-resize {
  cursor: w-resize;
}

.cursor-col-resize {
  cursor: col-resize;
}



*/

//hello
