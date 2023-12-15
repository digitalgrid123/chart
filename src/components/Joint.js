import React, { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import * as XLSX from "xlsx";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const HighchartsComponent = ({ title, data }) => {
  const chartOptions = {
    chart: {
      type: "line",
    },
    title: {
      text: title,
    },
    xAxis: {
      title: {
        text: "Frame ID",
      },
      categories: data.frameId,
    },
    yAxis: {
      title: {
        text: "Angles",
      },
    },
    series: [
      {
        name: title,
        data: data.speed,
        color: getRandomColor(),
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

function Joint() {
  const [distance, setDistance] = useState([]);
  const [personIds, setPersonIds] = useState([]);

  useEffect(() => {
    const excelFileURL =
      "https://webdev-vsstag-bucket.s3.eu-central-1.amazonaws.com/reports/hpe_1_2_3_1701431919412/chart_data.xlsx";

    fetch(excelFileURL)
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(new Uint8Array(data), { type: "array" });

        const sheetName = "joint_angles";
        const sheet = workbook.Sheets[sheetName];

        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const uniquePersonIds = new Set(
          sheetData.slice(1).map((row) => row[0])
        );
        setPersonIds(Array.from(uniquePersonIds));

        setDistance(sheetData);
      })
      .catch((error) => console.error("Error fetching Excel file:", error));
  }, []);

  const distanceName = distance[0] || [];
  const distanceData = distance.slice(1);

  const renderCharts = () => {
    return personIds.map((personId) => {
      const filteredData = distanceData.filter((row) => row[0] === personId);

      if (filteredData.length === 0) {
        return (
          <div key={personId}>
            <h2>No data available for Person {personId}</h2>
          </div>
        );
      }

      const slicedFilteredData = filteredData.map((row) => row.slice(1));
      const frameId = slicedFilteredData.map((row) => row[0]);

      return (
        <div key={personId}>
          <h1>Joint Angles over Time for Person {personId}</h1>
          <h1>Person ID: {personId}</h1>
          <HighchartsComponent
            title="Left Elbow Angle"
            data={{ frameId, speed: slicedFilteredData.map((row) => row[1]) }}
          />
          <HighchartsComponent
            title="Right Elbow Angle"
            data={{ frameId, speed: slicedFilteredData.map((row) => row[2]) }}
          />
          <HighchartsComponent
            title="Right Knee Angle"
            data={{ frameId, speed: slicedFilteredData.map((row) => row[3]) }}
          />
          <HighchartsComponent
            title="Left Knee Angle"
            data={{ frameId, speed: slicedFilteredData.map((row) => row[4]) }}
          />
        </div>
      );
    });
  };

  return <div>{renderCharts()}</div>;
}

export default Joint;
