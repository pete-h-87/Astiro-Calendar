import React, { useState } from "react";

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

export default function OveSelector5(props) {
  const [time, setTime] = useState();
  const [selectedItem, setSelectedItem] = useState(null);
  const [datasource, setDatasource] = useState(defaultData);

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
    return Math.round(hoursDecimal * 4) / 4;
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

  function timespanMouseDown(e) {
    let clickedItemData = e.currentTarget.dataset["id"];
    if (clickedItemData) {
      let id = Number(clickedItemData);
      let item = datasource.find((element) => element.ID === id);
      setSelectedItem(item);
      mouseMoveMode.current = "itemMove";
      mouseDownXPos.current = e.clientX;
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

  // check if the gap is big enough to move a div in, if not, bump over

  function canvasMouseUp(e) {
    mouseMoveMode.current = "";
    setSelectedItem(null);
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
    if (distancePoints > 0) {
      newEnd = getOverlapBorder(newEnd, true);
      newStart = changedItem.Start + (newEnd - changedItem.End);
    } else {
      newStart = getOverlapBorder(newStart, false);
      newEnd = changedItem.End + (newStart - changedItem.Start);
    }
    changedItem.Start = newStart;
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
  }

  return (
    <div>
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
