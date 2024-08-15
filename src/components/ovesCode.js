import React, { useEffect, useState } from "react";

const demoTimeSpans = [
  { start: "08:00", end: "08:15", travel: false },
  { start: "08:15", end: "08:30", travel: false },
  { start: "08:30", end: "08:45", travel: false },
];

const dummyDataSpans = [{ start: "xxx", end: "yyy" }];

// {start: '08:00', end: '08:15', travel: false, type: timeSpanType.Office},
const initialTimeSpan = { start: "", end: "" };

export default function OveSlider(props) {
  const [dummyData, setDummyData] = useState(demoTimeSpans);
  const [newTimeSpan, setNewTimeSpan] = useState(initialTimeSpan);
  const [time, setTime] = useState();
  // const [start, setStart] = useState(); //object array - to render a div - so its scalable with multiple div
  // const [end, setEnd] = useState();
  const [isMouseDown, setIsMouseDown] = useState(false);

  const yMouseDownRef = React.createRef();
  // console.log("dummydata outside any functions", dummyData);
  // console.log("time", time);
  // console.log("start", start);
  // console.log("end", end);
  // useEffect(() => {
  //   setDummyData([...dummyData, { start: start, end: end }]);
  //   console.log("dummyData", dummyData);
  // }, [end]);

  function canvasMouseMove(e) {
    let relativeXPos = e.clientX - e.target.offsetLeft;
    let totalWidth = e.target.offsetWidth;
    let positionFactor = relativeXPos / totalWidth;
    let hoursDecimal = 4 * positionFactor + 8;
    let hours = Math.floor(hoursDecimal);
    let fifteenMinutes = Math.round(((hoursDecimal - hours) * 60) / 15) * 15;
    // let fiveMinutes = Math.round(((hoursDecimal - hours) * 60) / 5) * 5;
    // let oneMinute = Math.round(((hoursDecimal - hours) * 60) / 1) * 1;

    const yOffset = e.clientY - yMouseDownRef.current;

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
    let relativeYStartPosition = e.clientY;
    // setStart(time);
    // setNewTimeSpan({ ...newTimeSpan, start: start });
    setNewTimeSpan({ ...newTimeSpan, start: time });
    yMouseDownRef.current = relativeYStartPosition;
    setIsMouseDown(true);
  }

  // function clockOut() {
  //   // setEnd(time);
  //   // console.log("timeSpan: ", newTimeSpan);
  //   console.log("isMouseDown", isMouseDown);
  //   if (isMouseDown) {
  //     // const completedTimeSpan = { ...newTimeSpan, end: time };
  //     console.log("inside if");
  //     console.log("end", time, typeof time);
  //     setNewTimeSpan({ ...newTimeSpan, end: time });
  //     console.log("newTimeSpan", newTimeSpan);
  //     setDummyData([...dummyData, newTimeSpan]);
  //     console.log("dummyData", dummyData);
  //     setNewTimeSpan(initialTimeSpan); // Reset for the next time span
  //   }
  //   // setStart(null);
  //   // setEnd(null);
  //   setIsMouseDown(false);
  //   console.log("no time span :(");
  // }

  function clockOut() {
    if (isMouseDown) {
      // Create a new time span object with the updated end time
      const completedTimeSpan = { ...newTimeSpan, end: time };

      // Update dummyData with the new time span using the callback version of setState
      setDummyData((prevDummyData) => [...prevDummyData, completedTimeSpan]);

      // Reset the newTimeSpan state to initial
      setNewTimeSpan(initialTimeSpan);
    }
    console.log("dummyData", dummyData);
    setIsMouseDown(false);
  }

  // useEffect(() => {
  //   setDummyData([...dummyData, newTimeSpan]);
  // }, [newTimeSpan]);

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
      </div>

      <div>Time={time}</div>
      <div>Start={newTimeSpan.start}</div>
      <div>End={newTimeSpan.end}</div>
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
