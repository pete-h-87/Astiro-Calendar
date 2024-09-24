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
  // const [cursor, setCursor] = useState("w-resize");

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "w" && selectedItem) {
        const newState = datasource.map((item) =>
          item.ID === selectedItem.ID ? { ...item, Status: "W" } : item
        );
        setDatasource(newState);
      } else if (e.key === "t" && selectedItem) {
        const newState = datasource.map((item) =>
          item.ID === selectedItem.ID ? { ...item, Status: "T" } : item
        );
        setDatasource(newState);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedItem, datasource]);

  // useEffect(() => {

  // })

  function timespanMouseDown(e) {
    e.preventDefault();
    // document.addEventListener('mousemove', timespanMouseMove);
    // document.addEventListener('mouseup', timespanMouseUp);
    let clickedItemData = e.currentTarget.dataset["id"];
    if (clickedItemData) {
      let id = Number(clickedItemData);
      let item = datasource.find((element) => element.ID === id);
      setSelectedItem(item);
      let moveMode = "itemMove";
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
              moveMode = "itemResizeSplit";
              break;
            } else {
              moveMode = "itemResizeEnd";
            }
          } else {
            moveMode = "itemResizeEnd";
          }
        } else if (
          e.clientX <
          e.target.offsetLeft + e.target.offsetWidth * 0.2
        ) {
          if (Number(target.start) === anElement.End) {
            if (hasNeighbor) {
              moveMode = "itemResizeSplit";
              break;
            } else {
              moveMode = "itemResizeStart";
            }
          } else {
            moveMode = "itemResizeStart";
          }
        }
      }
      // console.log(moveMode);
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
      mouseMoveMode.current === "itemResizeEnd"
    ) {
      handleItemMoveAndResize(e);
    } else if (mouseMoveMode.current === "itemResizeSplit") {
      handleSplitResize(e);
    }
    let cursorClass;
    let hasNeighbor = false;
    for (let index = 0; index < datasource.length; index++) {
      const anElement = datasource[index];
      const target = e.target.dataset;
      if (
        Number(target.end) === anElement.Start ||
        Number(target.start) === anElement.End
      ) {
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
            cursorClass = "cursor-col-resize";
            break;
          } else {
            cursorClass = "cursor-w-resize";
          }
        } else {
          cursorClass = "cursor-w-resize";
        }
      } else if (e.clientX < e.target.offsetLeft + e.target.offsetWidth * 0.2) {
        if (Number(target.start) === anElement.End) {
          if (hasNeighbor) {
            cursorClass = "cursor-col-resize";
            break;
          } else {
            cursorClass = "cursor-w-resize";
          }
        } else {
          cursorClass = "cursor-w-resize";
        }
      }
    }
    removeMoveCursor();
    cursorElementRef.current = {
      cursor: cursorClass,
      element: e.currentTarget,
    };
    e.currentTarget.classList.add(cursorClass); //confused on this
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
      // console.log(newStart)
    } else if (distancePoints < 0 && mouseMoveMode.current === "itemMove") {
      newEnd = getOverlapBorder(newEnd, false, false);
      newStart = getOverlapBorder(newStart, false, true);
    }
    if (
      mouseMoveMode.current === "itemResizeStart" ||
      mouseMoveMode.current === "itemMove"
    ) {
      changedItem.Start = newStart;
    }
    if (
      mouseMoveMode.current === "itemResizeEnd" ||
      mouseMoveMode.current === "itemMove"
    ) {
      changedItem.End = newEnd;
    }
    if (distancePoints < 0 && mouseMoveMode.current === "itemResizeStart") {
      newStart = getOverlapBorder(newStart, false, true);
      changedItem.Start = newStart;
    }
    if (distancePoints > 0 && mouseMoveMode.current === "itemResizeEnd") {
      newEnd = getOverlapBorder(newEnd, true, true);
      changedItem.End = newEnd;
    }
    mouseDownXPos.current = e.clientX;
    setDatasource(newState);
  }

  function handleSplitResize(e) {
    e.preventDefault();
    let nowPosX = e.clientX;
    let distancePoints = nowPosX - mouseDownXPos.current;
    if (Math.abs(distancePoints) < 5) return;
    let timeMovedFactor = distancePoints / 510;
    let timeMovedHours = timeMovedFactor * 24;
    let newState = [...datasource];
  
    let changedItem = newState.find((item) => item.ID === selectedItem.ID);
    
    let changedItemNeighbor = newState.find(
      (item) =>
        item.End === selectedItem.Start || item.Start === selectedItem.End
    );
  
    let newStart = changedItem.Start + Math.round(timeMovedHours * 4) / 4;
    let newEnd = changedItem.End + Math.round(timeMovedHours * 4) / 4;
  
    let newNeighborStart =
      changedItemNeighbor.Start + Math.round(timeMovedHours * 4) / 4;
    let newNeighborEnd =
      changedItemNeighbor.End + Math.round(timeMovedHours * 4) / 4;
  
    if (distancePoints !== 0) {
      if (changedItem.Start < changedItemNeighbor.Start) {
        changedItem.End = newEnd;
        changedItemNeighbor.Start = newNeighborStart;
      } else {
        changedItem.Start = newStart;
        changedItemNeighbor.End = newNeighborEnd;
      }
    }
    mouseDownXPos.current = e.clientX;
    setDatasource(newState);
  }


  // function handleSplitResize(e) {
  //   e.preventDefault();
  //   let nowPosX = e.clientX;
  //   let distancePoints = nowPosX - mouseDownXPos.current;
  //   if (Math.abs(distancePoints) < 5) return;
  //   let timeMovedFactor = distancePoints / 510;
  //   let timeMovedHours = timeMovedFactor * 24;
  //   let newState = [...datasource];

  //   let clickedSpan = newState.find((item) => item.ID === selectedItem.ID);

  //   let leftNeighbor = newState.find((item) => item.End === selectedItem.Start);

  //   let rightNeighbor = newState.find(
  //     (item) => item.Start === selectedItem.End
  //   );

  //   let newStart = clickedSpan.Start + Math.round(timeMovedHours * 4) / 4;
  //   let newEnd = clickedSpan.End + Math.round(timeMovedHours * 4) / 4;

  //   let newStartRightNeighbor =
  //     rightNeighbor.Start + Math.round(timeMovedHours * 4) / 4;
  //   let newEndLeftNeighbor =
  //     leftNeighbor.End + Math.round(timeMovedHours * 4) / 4;


  //   if (e.clientX > e.target.offsetLeft + e.target.offsetWidth * 0.8) {
  //     if (distancePoints !== 0) {
  //       console.log("END click moving");
  //       clickedSpan.End = newEnd;
  //       rightNeighbor.Start = newStartRightNeighbor;
  //     }
  //   } else if (e.clientX > e.target.offsetLeft + e.target.offsetWidth * 0.2) {
  //     if (distancePoints !== 0) {
  //       console.log("START click moving");
  //       clickedSpan.Start = newStart;
  //       leftNeighbor.End = newEndLeftNeighbor;
  //     }
  //   }

  //   mouseDownXPos.current = e.clientX;
  //   setDatasource(newState);
  // }






  // let newStartLeftNeighbor =
  //   changedItemLeftNeighbor.Start + Math.round(timeMovedHours * 4) / 4;
  // let newEndRightNeighbor =
  //   changedItemLeftNeighbor.End + Math.round(timeMovedHours * 4) / 4;

  // if (changedItem.Start < changedItemNeighbor.Start) {
  //   changedItem.End = newEnd;
  //   changedItemNeighbor.Start = newNeighborStart;
  // } else {
  //   changedItem.Start = newStart;
  //   changedItemNeighbor.End = newNeighborEnd;
  // }

  // if (distancePoints !== 0 && mouseMoveMode.current === "itemResizeSplit") {
  //   if (changedItem.Start < changedItemNeighbor.Start) {
  //     if (e.clientX > e.target.offsetLeft + e.target.offsetWidth * 0.8) {
  //       console.log()
  //     changedItem.End = newEnd;
  //     changedItemNeighbor.Start = newNeighborStart;
  //     } else if (e.clientX > e.target.offsetLeft + e.target.offsetWidth * 0.2)
  //     {
  //       console.log()
  //       // changedItem.End = newEnd;
  //       // changedItemNeighbor.Start = newNeighborStart;
  //     }
  //   } else if (changedItem.Start > changedItemNeighbor.Start) {
  //     if (e.clientX > e.target.offsetLeft + e.target.offsetWidth * 0.8) {
  //       console.log()
  //     } else if (e.clientX > e.target.offsetLeft + e.target.offsetWidth * 0.2) {
  //       console.log()
  //     changedItem.Start = newStart;
  //     changedItemNeighbor.End = newNeighborEnd;
  //     }
  //   }
  // }

  function timespanMouseUp(e) {
    e.preventDefault();
    mouseMoveMode.current = "";
    document.body.classList.remove("loading");
    setSelectedItem(null);

    // document.removeEventListener('mousemove', timespanMouseMove);
    // document.removeEventListener('mouseup', timespanMouseUp);

    // if (mouseMoveMode.current === "itemResizeStart" || mouseMoveMode.current === "itemResizeEnd") {
    //   return setSelectedItem(null);
    // }
    // if (isClickedRef.current === true) {
    //   isClickedRef.current = false;
    //   return setSelectedItem(null);
    // }
    // isClickedRef.current = true;
  }

  // HW - keep item selected, but have the functionality stop
  // HW - when selected, click a for arbeid, r for reise, colors based on that
  // HW - attach mouse events to document, and dismount
  // HW - attach clicking off on document to deselect the div previously selected
  // HW - create a drop down selector with random lines to pick from ("line1, line2, etc") - mimicing service order selector
  // correct the split handler to operate with three or more adjacent spans
  // HW - scrubbing

  // useEffect(() => {
  //   document.addEventListener('timespanMouseMove', timespanMouseMove);
  //   document.addEventListener('timespanMouseup', timespanMouseUp);

  //   return () => {
  //     document.removeEventListener('timespanMouseMove', timespanMouseMove);
  //     document.removeEventListener('timespanMouseup', timespanMouseUp);
  //   };
  // });

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
            if (newTime > element.Start && newTime < element.End) {
              result = element.Start; // Update result instead of returning
            }
          } else if (leadingEdge === false) {
            if (
              selectedItem.End >= element.Start &&
              selectedItem.End <= element.End
            ) {
              result = lastValidStartTime;
            }
          }
        } else if (directionRight === false) {
          if (leadingEdge === true) {
            if (newTime < element.End && newTime > element.Start) {
              result = element.End;
            }
          } else if (leadingEdge === false) {
            if (
              selectedItem.Start >= element.Start &&
              selectedItem.Start <= element.End
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
              selectedItem &&
              selectedItem.ID === item.ID &&
              mouseMoveMode.current !== "itemResizeSplit"
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
