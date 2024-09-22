// import { Test } from "./components/Test";
// import MultiRangeSlider from "./components/slider/MultiRangeSlider";
// import Layout from "./components/layout/TheLook";
// import Slider from "./components/slider2/Slider_two";
import "./global.css";
// import Grid from "./components/react-window/Timesheet";
import Slider9 from "./components/slider8/slider8";

function App(props) {
  return (
    <div className="page">
      {/* <Layout> */}
      {/* <Test />
      <MultiRangeSlider
        min={0}
        max={1000}
        onChange={({ min, max }) => console.log(`min = ${min}, max = ${max}`)}
      /> */}
      {/* // <Slider /> */}
      <Slider9 />
      {/* </Layout> */}
      {/* <Selector /> */}
    </div>
  );
}

export default App;
