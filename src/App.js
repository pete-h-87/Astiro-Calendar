// import { Test } from "./components/Test";
// import MultiRangeSlider from "./components/slider/MultiRangeSlider";
// import Layout from "./components/layout/TheLook";
// import Slider from "./components/slider2/Slider_two";
import "./global.css";
// import Grid from "./components/react-window/Timesheet";
import Selector from "./components/slider_three/selector";
import Slider4 from "./components/slider4/slider4";
import OveSelector5 from "./components/slider5/slider5";
import Slider6 from "./components/slider6/slider6";
import Slider7 from "./components/slider7/slider7";

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
      <Slider7 />
      {/* </Layout> */}
      {/* <Selector /> */}
    </div>
  );
}

export default App;
