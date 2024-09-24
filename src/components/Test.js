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

  if (distancePoints !== 0 && mouseMoveMode.current === "itemResizeSplit") {
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

function timespanMouseUp(e) {
  e.preventDefault();
  mouseMoveMode.current = "";
  document.body.classList.remove("loading");
  setSelectedItem(null);





  if (e.clientX > e.target.offsetLeft + e.target.offsetWidth * 0.8) {
    if (distancePoints < 0 && mouseMoveMode.current === "itemResizeSplit") {
      if (clickedSpan.End === rightNeighbor.Start) {
        console.log("END click going LEFT");
        clickedSpan.End = newEnd;
        rightNeighbor.Start = newStartRightNeighbor;
      } else if (clickedSpan.Start === leftNeighbor.End) {
        console.log("START click going LEFT");
        clickedSpan.Start = newStart;
        leftNeighbor.End = newEndLeftNeighbor;
      }
    } else if (
      distancePoints > 0 &&
      mouseMoveMode.current === "itemResizeSplit"
    ) {
      if (clickedSpan.End === rightNeighbor.Start) {
        console.log("END click going RIGHT");
        clickedSpan.End = newEnd;
        rightNeighbor.Start = newStartRightNeighbor;
      } else if (clickedSpan.Start === leftNeighbor.End) {
        console.log("START click going RIGHT");
        clickedSpan.Start = newStart;
        leftNeighbor.End = newEndLeftNeighbor;
      }
    }

  } else if (e.clientX > e.target.offsetLeft + e.target.offsetWidth * 0.2) {
    if (distancePoints < 0 && mouseMoveMode.current === "itemResizeSplit") {
      if (clickedSpan.End === rightNeighbor.Start) {
        console.log("END click going LEFT");
        clickedSpan.End = newEnd;
        rightNeighbor.Start = newStartRightNeighbor;
      } else if (clickedSpan.Start === leftNeighbor.End) {
        console.log("START click going LEFT");
        clickedSpan.Start = newStart;
        leftNeighbor.End = newEndLeftNeighbor;
      }
    } else if (
      distancePoints > 0 &&
      mouseMoveMode.current === "itemResizeSplit"
    ) {
      if (clickedSpan.End === rightNeighbor.Start) {
        console.log("END click going RIGHT");
        clickedSpan.End = newEnd;
        rightNeighbor.Start = newStartRightNeighbor;
      } else if (clickedSpan.Start === leftNeighbor.End) {
        console.log("START click going RIGHT");
        clickedSpan.Start = newStart;
        leftNeighbor.End = newEndLeftNeighbor;
      }
    }
  }