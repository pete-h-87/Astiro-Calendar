import React, { useState, useEffect } from "react";
import styles from "./slider8.module.css";

const defaultCompanyTasks = [
  "Bandak: Service on machine",
  "Bandak: Service on gantry",
  "Bandak: Service on valves",
  "Bandak: Service on hydraulics",
];

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
const canvasMouseDownXPos = React.createRef(0);
const cursorElementRef = React.createRef();
const resizingStart = React.createRef(false);
const canvasRef = React.createRef(false);
const spanRef = React.createRef();
const spanClickedRef = React.createRef(false);
const canvasClickedRef = React.createRef(false);

export default function Fnc(props) {
  const [time, setTime] = useState();
  const [selectedItem, setSelectedItem] = useState(null);
  const [datasource, setDatasource] = useState(defaultData);
  const [canvasClicked, setCanvasClicked] = useState(false);

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

  function timespanMouseDown(e) {
    e.preventDefault();
    spanClickedRef.current = true;
    let clickedItemData = e.target.dataset["id"];
    if (clickedItemData) {
      let id = Number(clickedItemData);
      let item = datasource.find((element) => element.ID === id);
      setSelectedItem(item);
      let moveMode = "itemMove";
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
              moveMode = "itemResizeSplit";
              resizingStart.current = false;
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
              resizingStart.current = true;
              break;
            } else {
              moveMode = "itemResizeStart";
            }
          } else {
            moveMode = "itemResizeStart";
          }
        }
      }
      mouseMoveMode.current = moveMode;
      mouseDownXPos.current = e.clientX;
      document.body.classList.add("loading");
    }
  }

  function timespanMouseMove(e) {
    // if (spanClickedRef.current === true) {
    e.preventDefault();
    spanRef.current = true;
    // console.log("move mode:", mouseMoveMode.current)
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
      const divId = Number(target.id);
      if (
        e.clientX > e.target.offsetLeft + e.target.offsetWidth * 0.8 &&
        datasource.some((item) => item.ID === divId)
      ) {
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
      } else if (
        e.clientX < e.target.offsetLeft + e.target.offsetWidth * 0.2 &&
        datasource.some((item) => item.ID === divId)
      ) {
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
      element: e.target,
    };
    e.target.classList.add(cursorClass); //confused on this
    // }
  }

  function handleItemMoveAndResize(e) {
    e.preventDefault();
    let nowPosX = e.clientX;
    let distancePoints = nowPosX - mouseDownXPos.current;
    if (Math.abs(distancePoints) < 5) return; //changed here to have it increment by .25, or 15 minutes
    let timeMovedFactor = distancePoints / 510;
    let timeMovedHours = timeMovedFactor * 24;
    let newState = [...datasource];
    let clickedSpan = newState.find((item) => item.ID === selectedItem.ID); // now, we can find the ID because
    let newStart = clickedSpan.Start + Math.round(timeMovedHours * 4) / 4; // the CLICK is first, the movement is second
    let newEnd = clickedSpan.End + Math.round(timeMovedHours * 4) / 4;
    if (distancePoints > 0 && mouseMoveMode.current === "itemMove") {
      newEnd = getOverlapBorder(newEnd, true, true);
      newStart = getOverlapBorder(newStart, true, false);
    } else if (distancePoints < 0 && mouseMoveMode.current === "itemMove") {
      newEnd = getOverlapBorder(newEnd, false, false);
      newStart = getOverlapBorder(newStart, false, true);
    }
    if (
      mouseMoveMode.current === "itemResizeStart" ||
      mouseMoveMode.current === "itemMove"
    ) {
      clickedSpan.Start = newStart;
    }
    if (
      mouseMoveMode.current === "itemResizeEnd" ||
      mouseMoveMode.current === "itemMove"
    ) {
      clickedSpan.End = newEnd;
    }
    if (distancePoints < 0 && mouseMoveMode.current === "itemResizeStart") {
      newStart = getOverlapBorder(newStart, false, true);
      clickedSpan.Start = newStart;
    }
    if (distancePoints > 0 && mouseMoveMode.current === "itemResizeEnd") {
      newEnd = getOverlapBorder(newEnd, true, true);
      clickedSpan.End = newEnd;
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
    let clickedSpan = newState.find((item) => item.ID === selectedItem.ID);
    let neighbor = newState.find(
      (item) =>
        (item.End === selectedItem.Start && resizingStart.current) ||
        (item.Start === selectedItem.End && !resizingStart.current)
    );
    let newStart = clickedSpan.Start + Math.round(timeMovedHours * 4) / 4;
    let newEnd = clickedSpan.End + Math.round(timeMovedHours * 4) / 4;
    let newNeighborStart = neighbor.Start + Math.round(timeMovedHours * 4) / 4;
    let newNeighborEnd = neighbor.End + Math.round(timeMovedHours * 4) / 4;
    if (distancePoints !== 0) {
      if (clickedSpan.Start < neighbor.Start) {
        clickedSpan.End = newEnd;
        neighbor.Start = newNeighborStart;
      } else {
        clickedSpan.Start = newStart;
        neighbor.End = newNeighborEnd;
      }
    }
    mouseDownXPos.current = e.clientX;
    setDatasource(newState);
  }

  function timespanMouseUp(e) {
    e.preventDefault();
    spanClickedRef.current = false;
    spanRef.current = false;
    mouseMoveMode.current = "";
    document.body.classList.remove("loading");
    setSelectedItem(null);
  }

  function handleRightClick(e) {
    e.preventDefault();
    console.log("handled");
    let x = document.getElementById("myDropdown");
    console.log(x);
    document.getElementById("myDropdown").classList.toggle(styles.show);
  }

  // HW - scrubbing
  // HW - create a drop down selector with random lines to pick from ("line1, line2, etc") - mimicing service order selector
  // HW - limit ability to collapse spans all the way.  minimum 15 minutes?
  // HW - ability to go left when creating span

  useEffect(() => {
    if (!canvasClicked) {
      document.addEventListener("mousedown", timespanMouseDown);
      document.addEventListener("mousemove", timespanMouseMove);
      document.addEventListener("mouseup", timespanMouseUp);
      return () => {
        document.removeEventListener("mousedown", timespanMouseDown);
        document.removeEventListener("mousemove", timespanMouseMove);
        document.removeEventListener("mouseup", timespanMouseUp);
      };
    }

    if (canvasClicked) {
      // document.addEventListener("mousemove", canvasMouseHover)
      document.addEventListener("mousemove", canvasMouseMove);
      document.addEventListener("mouseup", canvasMouseUp);
      return () => {
        // document.removeEventListener("mousemove", canvasMouseHover)
        document.removeEventListener("mousemove", canvasMouseMove);
        document.removeEventListener("mouseup", canvasMouseUp);
      };
    }
  });

  function canvasMouseDown(e) {
    e.preventDefault();
    setCanvasClicked(true);
    startTimeRef.current = xPosToHourDecimal(e);
    endTimeRef.current = e.target.dataset.End;
    let newState = [...datasource];
    let newItem = {
      ID: datasource.length + 1,
      Start: startTimeRef.current,
      End: endTimeRef.current,
      Text: "",
      Status: "",
    };
    newState.push(newItem);
    setDatasource(newState);
    setSelectedItem(newItem);
    mouseMoveMode.current = "newItemEnd";
    canvasMouseDownXPos.current = e.clientX;
  }

  function canvasMouseHover(e) {
    e.preventDefault();
    removeMoveCursor();
    let relativePos = e.clientX - canvasRef.current.offsetLeft;
    let totalWidth = canvasRef.current.offsetWidth;
    let positionFactor = relativePos / totalWidth;
    let hoursDecimal = 24 * positionFactor;
    let hours = Math.floor(hoursDecimal);
    let minutes = hoursDecimal - hours;
    minutes = minutes * 60;
    minutes = Math.round(minutes / 5) * 5;
    setTime(pad(hours, 2) + ":" + pad(minutes, 2));
  }

  function canvasMouseMove(e) {
    e.preventDefault();
    if (mouseMoveMode.current === "newItemEnd") {
      let nowPosX = e.clientX;
      let distancePoints = nowPosX - canvasMouseDownXPos.current;
      if (Math.abs(distancePoints) < 5) return; //changed here to have it increment by .25, or 15 minutes
      let timeMovedFactor = distancePoints / 510;
      let timeMovedHours = timeMovedFactor * 24;
      let newState = [...datasource];
      let changedItem = newState.find((item) => item.ID === selectedItem.ID);
      if (distancePoints > 0) {
      let newEnd = changedItem.Start + Math.round(timeMovedHours * 4) / 4;
      newEnd = getOverlapBorder(newEnd, true, true);
      changedItem.End = newEnd;
    } else if (distancePoints < 0) {
      changedItem.End = startTimeRef.current;
      let newStart = changedItem.End - Math.round(timeMovedHours * 4) / 4;
      newStart = getOverlapBorder(newStart, false, true);
      changedItem.Start = newStart;
    }
      setDatasource(newState);
    }

    // else if (
    //   mouseMoveMode.current === "itemMove" ||
    //   mouseMoveMode.current === "itemResizeStart" ||
    //   mouseMoveMode.current === "itemResizeEnd"
    // ) {
    //   handleItemMoveAndResize(e);
    // }
    // }
  }

  function canvasMouseUp(e) {
    e.preventDefault();
    setCanvasClicked(false);
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

  // window.onclick = function(event) {
  //   if (!event.target.matches(styles.dropbtn)) {
  //     var dropdowns = document.getElementsByClassName("dropdownContent");
  //     var i;
  //     for (i = 0; i < dropdowns.length; i++) {
  //       var openDropdown = dropdowns[i];
  //       if (openDropdown.classList.contains(styles.show)) {
  //         openDropdown.classList.remove(styles.show);
  //       }
  //     }
  //   }
  // }

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
        ref={canvasRef}
        // onMouseMove={canvasMouseMove}
        onMouseMove={canvasMouseHover}
        onMouseDown={canvasMouseDown}
        // onMouseUp={canvasMouseUp}
      />
      {datasource.map((item) => (
        <div>
          <div>
            <button
              ref={spanRef}
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
              onContextMenu={handleRightClick}
              className={styles.dropbtn}
              // onMouseDown={timespanMouseDown}
              // onMouseUp={timespanMouseUp}
              // onMouseMove={timespanMouseMove}
            >
              <div id="myDropdown" className={styles.dropdownContent}>
                {defaultCompanyTasks.map((task, index) => (
                  <a key={index} href={`taskNumber: ${index}`}>
                    {task}
                  </a>
                ))}
              </div>
            </button>
          </div>
        </div>
      ))}
      {/* <div style={{position:'absolute', left:'100px', top: '130px', width: '510px', height:'40px', backgroundColor: 'red'}} title='03:45 - 12:30 - Customer: Brødrene Jacobsen: ' ></div> */}
      <div>Time={time}</div>
      <div>SelectedData:{JSON.stringify(selectedItem)}</div>
    </div>
  );
}
