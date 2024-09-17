import React, { useState, useEffect } from "react";

const defaultData = [
  {
    ID: 1,
    Start: 4.0,
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
    End: 19.0,
    Text: "Bandak: Adjustment of gantry",
    Status: "T",
  },
];

const startTimeRef = React.createRef();
const endTimeRef = React.createRef();
const mouseMoveMode = React.createRef("");
const mouseDownXPos = React.createRef(0);
const cursorElementRef = React.createRef();
const isBumpedRef = React.createRef();

export default function Fnc(props) {
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
    let hoursDecimal = Math.round(24 * positionFactor * 4) / 4;
    return hoursDecimal;
  }

  function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
  }

  function timespanMouseDown(e) {
    e.preventDefault();
    let clickedItemData = e.currentTarget.dataset["id"];
    console.log(clickedItemData);
    // console.log(selectedItem);

    // console.log("current target:", clickedItemData);
    if (clickedItemData) {
      let id = Number(clickedItemData);
      let item = datasource.find((element) => element.ID === id);
      setSelectedItem(item);
      // console.log("selected item:", item);
      //set info about the movement - where did the click happen?  here is where it happened:
      let moveMode = "itemMove";
      if (e.clientX < e.target.offsetLeft + e.target.offsetWidth * 0.2) {
        moveMode = "itemResizeStart";
        // console.log("mouse is over the left edge:", moveMode)
      } // start of element
      else if (e.clientX > e.target.offsetLeft + e.target.offsetWidth * 0.8) {
        // end of element
        moveMode = "itemResizeEnd";
        // console.log("mouse is over the right edge:", moveMode)
      }
      mouseMoveMode.current = moveMode;
      mouseDownXPos.current = e.clientX;
      // console.log("xposDOWN:", mouseDownXPos.current);
      //setting done
      document.body.classList.add("loading");

      // let element = document.getElementById(clickedItemData.ID)
      // if (element) {
      //   element.classList.add("cursor-w-resize")
      // }
    }
    // if (selectedItem) {
    //   setSelectedItem(null)
    // }
  }

  function timespanMouseMove(e) {
    e.preventDefault();
    if (
      (selectedItem && mouseMoveMode.current === "itemMove") ||
      mouseMoveMode.current === "itemResizeStart" ||
      mouseMoveMode.current === "itemResizeEnd"
    ) {
      handleItemMoveAndResize(e);
      // console.log("selected item:", selectedItem);
      // console.log("mouseDown X pos:", mouseDownXPos.current)
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

  function handleItemMoveAndResize(e) {
    e.preventDefault();
    let nowPosX = e.clientX;
    let distancePoints = nowPosX - mouseDownXPos.current;
    // console.log("selectedItem:", selectedItem)
    // console.log(mouseDownXPos.current);
    // console.log(mouseMoveMode.current)
    if (Math.abs(distancePoints) < 5) return; //changed here to have it increment by .25, or 15 minutes
    // console.log("AFTER:", distancePoints)
    let timeMovedFactor = distancePoints / 510;
    let timeMovedHours = timeMovedFactor * 24;
    let newState = [...datasource];
    let changedItem = newState.find((item) => item.ID === selectedItem.ID); // now, we can find the ID because
    let newStart = changedItem.Start + Math.round(timeMovedHours * 4) / 4; // the CLICK is first, the movement is second
    let newEnd = changedItem.End + Math.round(timeMovedHours * 4) / 4;
    if (distancePoints > 0 && mouseMoveMode.current === "itemMove") {
      // console.log(mouseMoveMode.current)
      newEnd = getOverlapBorder(newEnd, true, true);
      newStart = getOverlapBorder(newStart, true, false);
    } else if (distancePoints < 0 && mouseMoveMode.current === "itemMove") {
      newEnd = getOverlapBorder(newEnd, false, true);
      newStart = getOverlapBorder(newStart, false, false);
      // newEnd = changedItem.End + (newStart - changedItem.Start);
    }
    if (mouseMoveMode.current !== "itemResizeEnd") {
      changedItem.Start = newStart;
    }
    if (mouseMoveMode.current !== "itemResizeStart") {
      changedItem.End = newEnd;
    }
    mouseDownXPos.current = e.clientX;
    setDatasource(newState);
    // mouseMoveMode.current = ''; HERE - makes going left like going right
    // console.log("after abs:", mouseMoveMode.current)
  }

  // useEffect(() => {
  //   // Attach the mouseup event listener to the window object
  //   window.addEventListener("mouseup", timespanMouseUp);

  //   // Cleanup function to remove the event listener
  //   return () => {
  //     window.removeEventListener("mouseup", timespanMouseUp);
  //   };
  // }, []);

  function timespanMouseUp(e) {
    e.preventDefault();
    setSelectedItem(null);
    mouseMoveMode.current = "";
    document.body.classList.remove("loading");
    //reset selected item when upclicked
    // isBumpedRef.current = false;
    // console.log("mouseMoveMode:", mouseMoveMode.current);
    // console.log("mouseUp", mouseDownXPos.current);
    // console.log("cursorElement", cursorElementRef.current);
    // console.log("isBumped", isBumpedRef.current);
    // console.log(selectedItem);
  }

  function canvasMouseDown(e) {
    startTimeRef.current = xPosToHourDecimal(e);
    endTimeRef.current = e.target.dataset.End; //added endTimeReft to grab the End to make it "end"
    //addNewData
    let newState = [...datasource];
    let newItem = {
      ID: datasource.length + 1,
      Start: startTimeRef.current,
      end: endTimeRef.current,
      Text: "",
      Status: "",
    };
    newState.push(newItem);
    setDatasource(newState);
    setSelectedItem(newItem);
    mouseMoveMode.current = "newItemEnd";
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
      // endTimeRef.current = changedItem.End;
      setDatasource(newState);
    } else if (
      mouseMoveMode.current === "itemMove" ||
      mouseMoveMode.current === "itemResizeStart" ||
      mouseMoveMode.current === "itemResizeEnd"
    ) {
      handleItemMoveAndResize(e);
    }
  }

  function canvasMouseUp(e) {
    mouseMoveMode.current = "";
    removeMoveCursor();
    setSelectedItem(null);
  }

  //HELPER FUNCITONS
  function removeMoveCursor() {
    if (cursorElementRef.current) {
      cursorElementRef.current.element.classList.remove(
        cursorElementRef.current.cursor
      );
      // console.log("removeMoveCursor funciton has fired")
    }
  }

  function getOverlapBorder(newTime, directionRight, theEnd) {
    let lastValidStartTime = selectedItem.Start;
    let lastValidEndTime = selectedItem.End;
    for (let index = 0; index < datasource.length; index++) {
      const element = datasource[index];
      if (element.ID !== selectedItem.ID) {
        if (
          newTime > element.Start &&
          newTime < element.End &&
          mouseMoveMode.current === "itemMove") 
        
            {isBumpedRef.current = true;
              console.log()
              return directionRight === true ? element.Start : element.End;} 
          
          else if (
          isBumpedRef.current === true &&
          mouseMoveMode.current === "itemMove") 
          
          {if (directionRight) 
            {
            console.log("RIGHT")
            if (theEnd === true) {
              // console.log(
              //   "NOT firing...",
              //   lastValidStartTime,
              //   lastValidEndTime
              // );
             
              return element.Start;
            } else if (theEnd === false && isBumpedRef.current === true) {
              // console.log("it's firing!", lastValidStartTime, lastValidEndTime);
              isBumpedRef.current = false;
              return lastValidStartTime;
            }
          } else {
            isBumpedRef.current = false;
            console.log("LEFT")
            return lastValidEndTime;
        
          }
        }
      }
    }
    return newTime;
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
          onMouseUp={timespanMouseUp}
          onMouseMove={timespanMouseMove}
        ></div>
      ))}
      {/* <div style={{position:'absolute', left:'100px', top: '130px', width: '510px', height:'40px', backgroundColor: 'red'}} title='03:45 - 12:30 - Customer: Brødrene Jacobsen: ' ></div> */}
      <div>Time={time}</div>
      <div>SelectedData:{JSON.stringify(selectedItem)}</div>
    </div>
  );
}
