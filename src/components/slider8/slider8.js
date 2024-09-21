import React, { useState, useEffect } from "react";

const defaultData = [
  {
    ID: 1,
    Start: 6.0,
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
const isClickedRef = React.createRef();

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
    if (clickedItemData) {
      let id = Number(clickedItemData);
      let item = datasource.find((element) => element.ID === id);
      setSelectedItem(item);
      let moveMode = "itemMove";
      if (e.clientX < e.target.offsetLeft + e.target.offsetWidth * 0.2) {
        moveMode = "itemResizeStart";
      } else if (e.clientX > e.target.offsetLeft + e.target.offsetWidth * 0.8) {
        moveMode = "itemResizeEnd";
      } else if (e.clientX > e.target.offsetLeft + e.target.offsetWidth * 0.8) {
        moveMode = "itemResizeSplit";
      }
      mouseMoveMode.current = moveMode;
      mouseDownXPos.current = e.clientX;
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
      mouseMoveMode.current === "itemResizeEnd" ||
      mouseMoveMode.current === "itemResizeSplit"
    ) {
      handleItemMoveAndResize(e);
    }

    let cursorClass;
    let hasNeighbor = false;
    for (let index = 0; index < datasource.length; index++) {
      const anElement = datasource[index];
      const target = e.target.dataset;
      // console.log(e.target.dataset)
      if (
        Number(target.end) === anElement.Start ||
        Number(target.start) === anElement.End
      ) {
        // console.log(anElement)
        hasNeighbor = true;
        
        break;
      }
    }
    
    for (let index = 0; index < datasource.length; index++) {
      const anElement = datasource[index];
      const target = e.target.dataset;
    if (e.clientX > e.target.offsetLeft + e.target.offsetWidth * 0.8) {
      if (Number(target.end) === anElement.Start) {
        if (hasNeighbor) {
          cursorClass = "cursor-col-resize"
          console.log("has neighbor to the RIGHT");
          // console.log(anElement)
          hasNeighbor = false;
          break;
        } else {
          cursorClass = "cursor-w-resize"
          console.log("has NO buddy to the RIGHT");
        }
      } else {
        console.log("x")
        cursorClass = "cursor-w-resize"
      };
    }
    else if (e.clientX < e.target.offsetLeft + e.target.offsetWidth * 0.2 ) {
      if (Number(target.start) === anElement.End) {
        if (hasNeighbor) {
          cursorClass = "cursor-col-resize"
          console.log("has neighbor to the LEFT");
          hasNeighbor = false;
          break;
        } else {
          cursorClass = "cursor-w-resize"
          console.log("has NO buddy to the LEFT");
        }
      } else {
        console.log("y")
        cursorClass = "cursor-w-resize"
        };
    }
  }

    // for (let index = 0; index < datasource.length; index++) {
    //   const anElement = datasource[index];
    //   const targetEnd = Number(e.target.dataset.end);
    //   if (anElement.ID !== e.target.dataset.id) {
    //     if (
    //       (e.clientX < e.target.offsetLeft + e.target.offsetWidth * 0.2 ||
    //         e.clientX > e.target.offsetLeft + e.target.offsetWidth * 0.8) &&
    //       targetEnd !== anElement.Start
    //     ) {
    //       console.log("no neighbor");
    //       cursorClass = "cursor-w-resize";
    //     } else if (
    //       (e.clientX < e.target.offsetLeft + e.target.offsetWidth * 0.2 ||
    //         e.clientX > e.target.offsetLeft + e.target.offsetWidth * 0.8) &&
    //       targetEnd === anElement.Start
    //     ) {
    //       console.log("BUMPING");
    //       cursorClass = "cursor-col-resize";
    //     }
    //   }
    // }

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
    if (Math.abs(distancePoints) < 5) return; //changed here to have it increment by .25, or 15 minutes
    let timeMovedFactor = distancePoints / 510;
    let timeMovedHours = timeMovedFactor * 24;
    let newState = [...datasource];
    let changedItem = newState.find((item) => item.ID === selectedItem.ID); // now, we can find the ID because
    let newStart = changedItem.Start + Math.round(timeMovedHours * 4) / 4; // the CLICK is first, the movement is second
    let newEnd = changedItem.End + Math.round(timeMovedHours * 4) / 4;
    if (distancePoints > 0 && mouseMoveMode.current === "itemMove") {
      newEnd = getOverlapBorder(newEnd, true, true);
      newStart = getOverlapBorder(newStart, true, false);
    } else if (distancePoints < 0 && mouseMoveMode.current === "itemMove") {
      newEnd = getOverlapBorder(newEnd, false, false);
      newStart = getOverlapBorder(newStart, false, true);
    }
    if (mouseMoveMode.current !== "itemResizeEnd") {
      changedItem.Start = newStart;
    }
    if (mouseMoveMode.current !== "itemResizeStart") {
      changedItem.End = newEnd;
    }
    mouseDownXPos.current = e.clientX;
    setDatasource(newState);
  }

  function timespanMouseUp(e) {
    if (isClickedRef.current === true) {
      isClickedRef.current = false;
      setSelectedItem(null);
    }
    if (selectedItem) {
      isClickedRef.current = true;
    } else {
      isClickedRef.current = false;
    }

    e.preventDefault();
    mouseMoveMode.current = "";
    document.body.classList.remove("loading"); // HW -  keep item selected, but have the functionality stop
    // HW - attach mouse events to document, and dismount
    // HW - attach clicking off on document to deselect the div previously selected
    // HW - create a drop down selector with random lines to pick from ("line1, line2, etc") - mimicing service order selector
    // when selected, click a for arbeid, r for reise, colors based on that
  }

  function canvasMouseDown(e) {
    startTimeRef.current = xPosToHourDecimal(e);
    endTimeRef.current = e.target.dataset.End;
    console.log(e.target.dataset.End);
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
    }
  }

  function getOverlapBorder(newTime, directionRight, leadingEdge) {
    let lastValidStartTime = selectedItem.Start;
    let lastValidEndTime = selectedItem.End;
    let result = newTime;
    for (let index = 0; index < datasource.length; index++) {
      const element = datasource[index];
      if (element.ID !== selectedItem.ID) {
        if (directionRight === true) {
          if (leadingEdge === true) {
            if (
              newTime > element.Start &&
              newTime < element.End &&
              mouseMoveMode.current === "itemMove"
            ) {
              result = element.Start; // Update result instead of returning
            }
          } else if (leadingEdge === false) {
            if (
              selectedItem.End >= element.Start &&
              selectedItem.End <= element.End &&
              mouseMoveMode.current === "itemMove"
            ) {
              result = lastValidStartTime;
            }
          }
        } else if (directionRight === false) {
          if (leadingEdge === true) {
            if (
              newTime < element.End &&
              newTime > element.Start &&
              mouseMoveMode.current === "itemMove"
            ) {
              result = element.End;
            }
          } else if (leadingEdge === false) {
            if (
              selectedItem.Start >= element.Start &&
              selectedItem.Start <= element.End &&
              mouseMoveMode.current === "itemMove"
            ) {
              result = lastValidEndTime;
            }
          }
        }
      }
    }
    return result; // Return the result after the loop
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
          data-start={item.Start}
          data-end={item.End}
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
