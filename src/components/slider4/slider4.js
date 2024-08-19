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
  const [time, setTime] = useState();
  const [selectedItem, setSelectedItem] = useState(null);
  const [datasource, setDatasource] = useState(defaultData);

  //   const startTimeRef = useRef();
  //   const endTimeRef = useRef();
  //   const mouseMoveMode = useRef("");
  //   const mouseDown = useRef(false);
  const canvasRef = useRef(null);

  const timeConvertToXpos = (timeNumber) => {
    const positionX = (timeNumber / 24) * 510 + 100;
    return positionX;
    console.log(positionX);
  };

  return (
    <div>
      <div>
        <div style={{ margin: "100px 0 0 100px" }}>
          00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22
          23
        </div>
        <div
          style={{
            width: "510px",
            height: "50px",
            backgroundColor: "rgba(173, 216, 230, 0.5)",
            margin: "5px 0 0 100px",
            border: "1px solid black",
          }}
          id="canvas"
          ref={canvasRef}
        />
        {datasource.map((item) => (
          <div
            key={item.ID}
            data-id={item.ID}
            style={{
              position: "absolute",
              left: timeConvertToXpos(item.Start),
              top: "130px",
              width:
                timeConvertToXpos(item.End) - timeConvertToXpos(item.Start),
              height: "40px",
              backgroundColor: item.Status === "W" ? "red" : "blue",
              border:
                selectedItem && selectedItem.ID === item.ID
                  ? "4px solid green"
                  : "2px solid black",
              borderRadius: "5px",
            }}
            title={item.Text}
            //   onMouseDown={timespanMouseDown}
            //   onMouseUp={canvasMouseUp}
            //   onMouseMove={timespanMouseMove}
          ></div>
        ))}
      </div>
      <div>Time={time}</div>
      <div>SelectedData:{JSON.stringify(selectedItem)}</div>
    </div>
  );
}
