import React, { useRef, useState } from "react";

const demoTimeSpans = [
  { start: "08:00", end: "08:15", travel: false },
  { start: "08:15", end: "08:30", travel: false },
  { start: "08:30", end: "08:45", travel: false },
];

// const dummyDataSpans = [{ start: "xxx", end: "yyy" }];

// {start: '08:00', end: '08:15', travel: false, type: timeSpanType.Office},
// const initialTimeSpan = { start: "", end: "" };

export default function OveSlider(props) {
  const [dummyData, setDummyData] = useState([]);
  // const [newTimeSpan, setNewTimeSpan] = useState(initialTimeSpan);
  const [time, setTime] = useState();
  const [start, setStart] = useState(); //object array - to render a div - so its scalable with multiple div
  const [end, setEnd] = useState();
  const [isMouseDown, setIsMouseDown] = useState(false);

  const startXRef = useRef(null);
  const endXRef = useRef(null);
  // const yMouseDownRef = React.createRef();
  // console.log("dummydata outside any functions", dummyData);
  // console.log("time", time);
  // console.log("start", start);
  // console.log("end", end);

  function canvasMouseMove(e) {
    let relativeXPos = e.clientX - e.target.offsetLeft;
    let totalWidth = e.target.offsetWidth;
    let positionFactor = relativeXPos / totalWidth;
    let hoursDecimal = 4 * positionFactor + 8;
    let hours = Math.floor(hoursDecimal);
    let fifteenMinutes = Math.round(((hoursDecimal - hours) * 60) / 15) * 15;
    // let fiveMinutes = Math.round(((hoursDecimal - hours) * 60) / 5) * 5;
    // let oneMinute = Math.round(((hoursDecimal - hours) * 60) / 1) * 1;
    console.log(fifteenMinutes);
    // const yOffset = e.clientY - yMouseDownRef.current;

    if (fifteenMinutes === 60) {
      fifteenMinutes = 0;
      hours++;
    }
    setTime(pad(hours, 2) + ":" + pad(fifteenMinutes, 2));

    //   if (isMouseDown) {
    //     if (yOffset > 150) {
    //       setTime(pad(hours, 2) + ":" + pad(fiveMinutes, 2));
    //     }
    //     if (yOffset > 250) {
    //       setTime(pad(hours, 2) + ":" + pad(oneMinute, 2));
    //     }
    //   }
  }

  function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
  }

  function clockIn(e) {
    // let relativeYStartPosition = e.clientY;
    setStart(time);
    startXRef.current = e.nativeEvent.offsetX;
    // yMouseDownRef.current = relativeYStartPosition;
    setIsMouseDown(true);
  }

  function clockOut(e) {
    endXRef.current = e.nativeEvent.offsetX;
    if (isMouseDown) {
      setDummyData([...dummyData, { start: start, end: time }]);
    }
    if (startXRef.current !== null) {
      startXRef.current = null;
      endXRef.current = null;
    }
    setEnd(time);
    setIsMouseDown(false);
    // console.log("dummydata inside clockOUT", dummyData);
  }

  const calculateLeftPosition = (startTime) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const startDecimal = hours + minutes / 60;
    const positionFactor = (startDecimal - 8) / 4; // Assuming the range is from 8 to 12
    return positionFactor * 480; // Assuming the total width is 480px
  };

  const calculateWidth = (startTime, endTime) => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    const startDecimal = startHours + startMinutes / 60;
    const endDecimal = endHours + endMinutes / 60;
    const widthFactor = (endDecimal - startDecimal) / 4; // Assuming the range is from 8 to 12
    return widthFactor * 480; // Assuming the total width is 480px
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "480px",
          margin: "50px 0 0 100px",
        }}
      >
        <div>08</div>
        <div>09</div>
        <div>10</div>
        <div>11</div>
        <div>12</div>
      </div>

      <div
        style={{
          position: "relative",
          width: "480px",
          height: "300px",
          backgroundColor: "rgba(255, 255, 255, .1)",
          margin: "5px 0 0 100px",

          boxSizing: "border-box",
        }}
        id="canvas"
        onMouseMove={canvasMouseMove}
        onMouseDown={clockIn}
        onMouseUp={clockOut}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "10%",
            backgroundColor: "rgba(50, 150, 50, 0.5)",
            boxSizing: "border-box",
            zIndex: -1,
          }}
        ></div>
        <div>
          {dummyData.map((object, index) => {
            const left = calculateLeftPosition(object.start);
            const width = calculateWidth(object.start, object.end);
            return (
              <React.Fragment>
                <div
                  key={`${object.start}-${object.end}-${index}`}
                  style={{
                    display: "inline-block",
                    position: "relative",
                    left: `${left}px`,
                    top: "0px",
                    width: `${width}px`,
                    height: "30px",
                    backgroundColor: "lightblue",
                    zIndex: -1,
                  }}
                >
                  <div
                    style={{
                      position: "fixed",
                    }}
                  >
                    {object.start} - {object.end}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div>Time={time}</div>
      <div>Start={start}</div>
      <div>End={end}</div>

      {/* <div>
        {dummyData.map((object, index) => (
          <React.Fragment key={`${object.start}-${object.end}-${index}`}>
            <div>{object.start}</div>
            <div>{object.end}</div>
          </React.Fragment>
        ))}
      </div> */}
    </div>
  );
}

// {timeSpans.map}

/* <div
        style={{
          position: "absolute",
          left: "150px",
          top: "130px",
          width: "200px",
          height: "40px",
          backgroundColor: "yellow",
        }}
      ></div> */
