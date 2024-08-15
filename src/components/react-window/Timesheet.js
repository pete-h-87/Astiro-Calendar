import React, { useState, useCallback } from "react";
import Scheduler, {
  Editing,
  Resource,
  View,
  Scrolling,
} from "devextreme-react/scheduler";
import notify from "devextreme/ui/notify";
import { resources, generateAppointments } from "./data.js";

const currentDate = new Date(2021, 1, 2);
const groups = ["humanId"];
const startDay = new Date(2021, 1, 1);
const endDay = new Date(2021, 1, 28);
const startDayHour = 6;
const endDayHour = 20;
const appointments = generateAppointments(
  startDay,
  endDay,
  startDayHour,
  endDayHour
);

const showToast = (event, value, type) => {
  notify(`${event} "${value}" task`, type, 800);
};
// const showAddedToast = (e) => {
//   showToast("Added", e.appointmentData.text, "success");
// };
// const showUpdatedToast = (e) => {
//   showToast("Updated", e.appointmentData.text, "info");
// };
// const showDeletedToast = (e) => {
//   showToast("Deleted", e.appointmentData.text, "warning");
// };

const Grid = () => {
  const [allowAdding, setAllowAdding] = useState(true);
  const [allowDeleting, setAllowDeleting] = useState(true);
  const [allowResizing, setAllowResizing] = useState(true);
  const [allowDragging, setAllowDragging] = useState(true);
  const [allowUpdating, setAllowUpdating] = useState(true);

  // const onAllowAddingChanged = useCallback((e) => setAllowAdding(e.value), []);
  
  // const onAllowDeletingChanged = useCallback(
  //   (e) => setAllowDeleting(e.value),
  //   []
  // );
  // const onAllowResizingChanged = useCallback(
  //   (e) => setAllowResizing(e.value),
  //   []
  // );
  // const onAllowDraggingChanged = useCallback(
  //   (e) => setAllowDragging(e.value),
  //   []
  // );
  // const onAllowUpdatingChanged = useCallback(
  //   (e) => setAllowUpdating(e.value),
  //   []
  // );

  return (
    <Scheduler
      dataSource={appointments}
      height={730}
      defaultCurrentView="Timeline"
      defaultCurrentDate={currentDate}
      startDayHour={startDayHour}
      endDayHour={endDayHour}
      cellDuration={60}
      showAllDayPanel={false}
      groups={groups}
    >
      <Editing
        allowAdding={allowAdding}
        allowDeleting={allowDeleting}
        allowResizing={allowResizing}
        allowDragging={allowDragging}
        allowUpdating={allowUpdating}
      />
      <View
        type="timelineWorkWeek"
        name="Timeline"
        groupOrientation="vertical"
        cellDuration= {60}
        intervalCount= {2}

      />
      <View type="workWeek" groupOrientation="vertical" />
      <View type="month" groupOrientation="horizontal" />
      <Resource fieldExpr="humanId" dataSource={resources} label="Employee" />
      <Scrolling mode="virtual" />
    </Scheduler>
  );
};

export default Grid;
