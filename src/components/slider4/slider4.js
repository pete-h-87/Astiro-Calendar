import React, { useRef, useState, useEffect } from "react";

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

export default function Slider4(props) {
  //states
  const [time, setTime] = useState();
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedSpan, setSelectedSpan] = useState(null);
  const [datasource, setDatasource] = useState(defaultData);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasMargin, setCanvasMargin] = useState(0);
  const [newTimeSpan, setNewTimeSpan] = useState(null);
  //end of states

  //refs
  const canvasRef = useRef(null);
  const draggingRef = useRef(false);
  const startTimeRef = useRef();
  const endTimeRef = useRef();

  const spanDivRef = useRef(null);
  const refLeft = useRef(null);
  const refRight = useRef(null);
  //end of refs

  //helper functions
  function timeConvertToXpos(timeNumber) {
    const positionX = (timeNumber / 24) * canvasWidth + canvasMargin;
    return positionX;
  }

  function xPosConvertToTime(xPos) {
    let relativePos = xPos.clientX - xPos.target.offsetLeft;
    let totalWidth = xPos.target.offsetWidth;
    let positionFactor = relativePos / totalWidth;
    let hoursDecimal = 24 * positionFactor;
    return hoursDecimal;
  }

  function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
  }
  //end of helper functions

  // useEffect(() => {
  //   const resizableElement = spanDivRef.current;
  //   const styles = window.getComputedStyle(resizableElement);
  //   let width = parseInt(styles.width, 10);

  //   let xCord = 0;
  //   resizableElement.style.left = "150px";

  //   //LEFT RESIZE
  //   function onMouseDown_LeftResize(e) {
  //     xCord = e.clientX;
  //     resizableElement.style.left = styles.left;
  //     resizableElement.style.right = null;
  //     document.addEventListener("mousemove", onMouseMove_LeftResize);
  //     document.addEventListener("mouseup", onMouseUp_LeftResize);
  //   }

  //   function onMouseMove_LeftResize(e) {
  //     xCord = e.clientX;
  //     const dx = e.clientX - xCord;
  //     width = width - dx;
  //     resizableElement.style.width = `${width}px`;
  //   }

  //   function onMouseUp_LeftResize(e) {
  //     document.removeEventListener("mousemove", onMouseMove_LeftResize);
  //   }
  //   //END OF LEFT RESIZE

  //   //RIGHT RESIZE
  //   function onMouseDown_RightResize(e) {
  //     xCord = e.End;
  //     resizableElement.style.right = styles.right;
  //     resizableElement.style.left = null;
  //     document.addEventListener("mousemove", onMouseMove_RightResize);
  //     document.addEventListener("mouseup", onMouseUp_RightResize);
  //   }

  //   function onMouseMove_RightResize(e) {
  //     xCord = e.clientX;
  //     const dx = e.clientX - xCord;
  //     width = width + dx;
  //     resizableElement.style.width = `${width}px`;
  //   }

  //   function onMouseUp_RightResize(e) {
  //     document.removeEventListener("mousemove", onMouseMove_RightResize);
  //   }
  //   //END OF RIGHT RESIZE

  //   //ADD mouseDown event listeners
  //   const resizerLeft = refRight.current;
  //   resizerLeft.addEventListener("mousedown", onMouseDown_LeftResize);

  //   const resizerRight = refLeft.current;
  //   resizerRight.addEventListener("mousedown", onMouseDown_RightResize);
  //   //REMOVE event listeners

  //   return () => {
  //     resizerLeft.removeEventListener("mousedown", onMouseDown_LeftResize);
  //     resizerRight.removeEventListener("mousedown", onMouseDown_RightResize);
  //   }
  // }, []);

  function handleOnDrag(e: DragEvent): void {
    console.log("dragging");
    e.dataTransfer.setData("text", e.target.id);
  }

  useEffect(() => {
    if (canvasRef.current) {
      setCanvasWidth(canvasRef.current.offsetWidth);
      const computedStyle = getComputedStyle(canvasRef.current);
      const marginLeft = parseInt(computedStyle.marginLeft, 10);
      setCanvasMargin(marginLeft); //maybe turn into a ref
      console.log(canvasRef.current.offsetWidth);
    }

    function newTimeSpanMouseDown(e) {
      if (e.target.id === "canvas") {
        startTimeRef.current = xPosConvertToTime(e);
        endTimeRef.current = startTimeRef.current;
        draggingRef.current = true;
        setNewTimeSpan({
          Id: 5, //change
          Start: startTimeRef.current,
          End: endTimeRef.current,
          Text: "New XXX",
          Status: "W",
        });
      }
    }

    function newTimeSpanMouseMove(e) {
      if (draggingRef.current) {
        //isDraggingRef
        endTimeRef.current = xPosConvertToTime(e);
        setNewTimeSpan({
          ...newTimeSpan,
          End: endTimeRef.current,
        });
        let hoursDecimal = xPosConvertToTime(e); //**MOVED THIS OUT OF AN ELSE - was attached to whole doc...
        let hours = Math.floor(hoursDecimal);
        let minutes = hoursDecimal - hours;
        minutes = minutes * 60;
        minutes = Math.round(minutes / 5) * 5;
        setTime(pad(hours, 2) + ":" + pad(minutes, 2));
      } //datasource.find function to search an array to see if we are bumping into another rendered div
    }

    //actual moving divs around - limit the moving and be able to move
    //change curser when clicked down to indicate to user that they can move horizontally
    //changing sizes of divs with mover marker curser
    // when hovering over the edge of a div, like an end piont, a box appears showing the time

    const newTimeSpanMouseUp = (e) => {
      if (draggingRef.current && canvasRef.current) {
        draggingRef.current = false;
        if (startTimeRef.current && endTimeRef.current) {
          let newItem = {
            ID: datasource.length + 1,
            Start: Math.min(startTimeRef.current, endTimeRef.current),
            End: Math.max(startTimeRef.current, endTimeRef.current),
            Text: "New YYY",
            Status: "N",
          };
          setDatasource([...datasource, newItem]);
          setNewTimeSpan(null);
        }
      }
    };

    canvasRef.current.addEventListener("mousedown", newTimeSpanMouseDown);
    document.addEventListener("mousemove", newTimeSpanMouseMove);
    document.addEventListener("mouseup", newTimeSpanMouseUp);

    return () => {
      canvasRef.current.removeEventListener("mousedown", newTimeSpanMouseDown);
      document.removeEventListener("mousemove", newTimeSpanMouseMove);
      document.removeEventListener("mouseup", newTimeSpanMouseUp);
    };
  }, [datasource, newTimeSpan]);

  function canvasMouseMove(e) {
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

  function existingTimeSpanMouseDown(e) {
    const div = e.target;
    const id = div.dataset.id;
    const start = div.dataset.start;
    const end = div.dataset.end;
    const text = div.dataset.title;
    const status = div.dataset.status;

    // Find the item that was clicked
    console.log(
      `ID: ${id}, Start: ${start}, End: ${end}, Text: ${text}, Status: ${status}`
    );

    // setSelectedItemData(e.target.dataset);

    if (id) {
      const parsedId = parseInt(id, 10);
      if (selectedItemId === parsedId) {
        setSelectedItemId(null); // Deselect if the same item is clicked
      } else {
        setSelectedItemId(parsedId); // Select the new item
      }
    }
  }

  return (
    <div>
      <div>
        <div style={{ margin: "100px 0 0 100px" }}>
          00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22
          23 24
        </div>
        <div
          style={{
            width: "470px",
            height: "50px",
            backgroundColor: "rgba(173, 216, 230, 0.5)",
            margin: "5px 0 0 100px",
            border: "1px solid black",
          }}
          id="canvas"
          ref={canvasRef}
          onMouseMove={canvasMouseMove}
        />
        {datasource.map((item) => (
          <div
            ref={spanDivRef}
            key={item.ID}
            data-id={item.ID}
            data-title={item.Text}
            data-end={item.End}
            data-start={item.Start}
            data-status={item.Status}
            draggable="true"
            onDragStart={(e) => handleOnDrag(e, item.ID)}
            style={{
              position: "absolute",
              left: timeConvertToXpos(item.Start),
              top: "130px",
              width:
                timeConvertToXpos(item.End) - timeConvertToXpos(item.Start),
              height: "40px",
              backgroundColor: item.Status === "W" ? "red" : "blue",
              border: selectedItemId === item.ID ? "4px solid green" : "none",
              borderRadius: "5px",
            }}
            onMouseDown={existingTimeSpanMouseDown}
            //   onMouseDown={timespanMouseDown}
            //   onMouseUp={canvasMouseUp}
            //   onMouseMove={timespanMouseMove}
          ></div>
        ))}
        {newTimeSpan ? (
          <div
            key={newTimeSpan.ID}
            data-id={newTimeSpan.ID}
            // data-text={newTimeSpan.Text} // HOW?
            style={{
              position: "absolute",
              left: timeConvertToXpos(newTimeSpan.Start),
              top: "130px",
              width:
                timeConvertToXpos(newTimeSpan.End) -
                timeConvertToXpos(newTimeSpan.Start), //PLUS the left offset gap
              height: "40px",
              backgroundColor: newTimeSpan.Status === "W" ? "red" : "blue",
              border:
                selectedItemId === newTimeSpan.ID ? "4px solid green" : "none",
              borderRadius: "5px",
            }}
          ></div>
        ) : null}
      </div>
      <div>Time={time}</div>
      <div>SelectedData - Id:{JSON.stringify(selectedItemId)}</div>
    </div>
  );
}

// how do i see the object for each div in the console?
