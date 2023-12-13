import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import BarChart from "./components/BarChart";
import LineGraph from "./components/lineGraph";
import Circle from "./components/Circle";
import HorizontalBar from "./components/HorizontalBar";
import VerticalChart from "./components/VerticalChart";
import Radar from "./components/Radar";
import ProxmityMap from "./components/ProxmityMap";
import BoxPlot from "./components/BoxPlot";
import Voilin from "./components/Voilin";
import Table from "./components/Table";
import DistanceRadar from "./components/DistanceRadar";
import Joint from "./components/Joint";
import Correlation from "./components/Correlation";
import Plot from "./components/Plot";

function App() {
  const [dataState, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://webdev-vsstag-bucket.s3.eu-central-1.amazonaws.com/reports/od_1_2_2_1700656334494/chart_data.xlsx",
          {
            responseType: "arraybuffer",
          }
        );

        const arrayBuffer = await response.arrayBuffer();

        const dataArray = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(dataArray, { type: "array" });

        // Assume data is in the first sheet (you may need to adjust this)
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const parsedData = XLSX.utils.sheet_to_json(sheet);

        setData(parsedData);
      } catch (error) {
        console.error("Error reading Excel data:", error);
      }
    };

    fetchData();
  }, []);

  const scissorsFrameIds = [];
  const velocityscirssors = [];
  const forcepFrameId_1 = [];
  const velocityspring_1 = [];
  const forcepFrameId_4 = [];
  const velocityspring_4 = [];

  dataState.forEach((item) => {
    if (item.instrument_id.toLowerCase() === "scissors_1") {
      scissorsFrameIds.push(item.frame_id);
      velocityscirssors.push(item.velocity);
    }

    if (
      item.instrument_id.toLowerCase().replace(/\s/g, "") === "springforceps_2"
    ) {
      forcepFrameId_1.push(item.frame_id);
      velocityspring_1.push(item.velocity);
    }
    if (
      item.instrument_id.toLowerCase().replace(/\s/g, "") === "springforceps_4"
    ) {
      forcepFrameId_4.push(item.frame_id);
      velocityspring_4.push(item.velocity);
    }
  });

  return (
    <div className="css">
      {/* <BarChart dataState={dataState} />
      <Radar />
      <HorizontalBar />
      <VerticalChart />
      <LineGraph
        // scissorsFrameIds={scissorsFrameIds}
        // velocityscirssors={velocityscirssors}
        // forcepFrameId={forcepFrameId_1}
        // velocityspring={velocityspring_1}
        // forcepFrameIdfour={forcepFrameId_4}
        // velocityspringfour={velocityspring_4}
      />
      <Circle />
      <ProxmityMap /> */}
      {/* <BoxPlot /> */}
      {/* <Voilin /> */}
      {/* <Table /> */}
      {/* <DistanceRadar />
       */}
      {/* <Joint /> */}
      {/* <Correlation /> */}
      <Plot />
    </div>
  );
}

export default App;
