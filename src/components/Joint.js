import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Line } from "react-chartjs-2";

function Joint() {
  const [distance, setDistance] = useState([]);
  const [currentId, setCurrentId] = useState(2);
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

        setDistance(sheetData);
      })
      .catch((error) => console.error("Error fetching Excel file:", error));
  }, []);
  const distanceName = distance[0] || [];
  const distanceData = distance.slice(1);

  const filteredData = distanceData.filter((row) => row[0] === currentId);
  const slicedFilteredData = filteredData.map((row) => row.slice(1));

  if (!slicedFilteredData || slicedFilteredData.length === 0) {
    return <div>No Person {currentId} exists with the specified ID</div>;
  }

  const frameId = slicedFilteredData.map((row) => row[0]);
  const leftelbow = slicedFilteredData.map((row) => row[1]);
  const rightelbow = slicedFilteredData.map((row) => row[2]);
  const rightknee = slicedFilteredData.map((row) => row[3]);
  const leftknee = slicedFilteredData.map((row) => row[4]);

  const leftelbowData = {
    labels: frameId,
    datasets: [
      {
        label: "Other",
        data: leftelbow,
        fill: false,
        borderColor: "#00be8c",
      },
    ],
  };
  const rightelbowData = {
    labels: frameId,
    datasets: [
      {
        label: "Other",
        data: rightelbow,
        fill: false,
        borderColor: "#00be8c",
      },
    ],
  };
  const rightkneeData = {
    labels: frameId,
    datasets: [
      {
        label: "Other",
        data: rightknee,
        fill: false,
        borderColor: "#00be8c",
      },
    ],
  };
  const leftkneeData = {
    labels: frameId,
    datasets: [
      {
        label: "Other",
        data: leftknee,
        fill: false,
        borderColor: "#00be8c",
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Frame ID",
          font: {
            size: 16,
          },
        },
        min: 0,
        max: 100,
        ticks: {
          stepSize: 50, // Set the step size between ticks
          beginAtZero: true,
          maxTicksLimit: 4,
        }, // Set the step size for x-axis ticks
      },
      y: {
        title: {
          display: true,
          text: "Angles",
          font: {
            size: 16,
          },
        },
        min: 0,
        max: 180,
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 4,
        },
      },
    },
    plugins: { legend: { display: false } },
  };

  return (
    <div>
      <h1>Left Elbow Angle</h1>
      <Line data={leftelbowData} options={options} />
      <h1>Right Elbow Angle</h1>
      <Line data={rightelbowData} options={options} />
      <h1>Right Knee Angle</h1>
      <Line data={rightkneeData} options={options} />
      <h1>Left Knee Angle</h1>
      <Line data={leftkneeData} options={options} />
    </div>
  );
}

export default Joint;
