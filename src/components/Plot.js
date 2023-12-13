import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Line } from "react-chartjs-2";

function Plot() {
  const [distance, setDistance] = useState([]);
  const [currentId, setCurrentId] = useState(1);
  useEffect(() => {
    const excelFileURL =
      "https://webdev-vsstag-bucket.s3.eu-central-1.amazonaws.com/reports/hpe_1_2_3_1701431919412/chart_data.xlsx";

    fetch(excelFileURL)
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(new Uint8Array(data), { type: "array" });

        const sheetName = "velocity_line";
        const sheet = workbook.Sheets[sheetName];

        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        setDistance(sheetData);
      })
      .catch((error) => console.error("Error fetching Excel file:", error));
  }, []);
  const distanceData = distance.slice(1);

  const filteredData = distanceData.filter((row) => row[0] === currentId);

  const frameId = filteredData.map((row) => row[1]);
  const KP_8_right_elbow_speed = filteredData.map((row) => row[2]);
  const KP_7_left_elbow_speed = filteredData.map((row) => row[3]);
  const KP_9_left_wrist_speed = filteredData.map((row) => row[4]);
  const KP_6_right_shoulder_speed = filteredData.map((row) => row[5]);
  const KP_10_right_wrist_speed = filteredData.map((row) => row[6]);
  const KP_5_left_shoulder_speed = filteredData.map((row) => row[7]);

  const right_elbowData = {
    labels: frameId,
    datasets: [
      {
        label: "Other",
        data: KP_8_right_elbow_speed,
        fill: false,
        borderColor: "#00be8c",
      },
    ],
  };
  const left_elbowData = {
    labels: frameId,
    datasets: [
      {
        label: "Other",
        data: KP_7_left_elbow_speed,
        fill: false,
        borderColor: "#00be8c",
      },
    ],
  };
  const left_wristData = {
    labels: frameId,
    datasets: [
      {
        label: "Other",
        data: KP_9_left_wrist_speed,
        fill: false,
        borderColor: "#00be8c",
      },
    ],
  };
  const right_shoulderData = {
    labels: frameId,
    datasets: [
      {
        label: "Other",
        data: KP_6_right_shoulder_speed,
        fill: false,
        borderColor: "#00be8c",
      },
    ],
  };
  const right_wristData = {
    labels: frameId,
    datasets: [
      {
        label: "Other",
        data: KP_10_right_wrist_speed,
        fill: false,
        borderColor: "#00be8c",
      },
    ],
  };
  const left_shoulderData = {
    labels: frameId,
    datasets: [
      {
        label: "Other",
        data: KP_5_left_shoulder_speed,
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

  //   if (!slicedFilteredData || slicedFilteredData.length === 0) {
  //     return <div>No Person {currentId} exists with the specified ID</div>;
  //   }
  return (
    <div>
      <Line data={right_elbowData} options={options} />
      <h1>Left Elbow Angle</h1>
      <Line data={left_elbowData} options={options} />
      <h1>Left Wrist Angle</h1>
      <Line data={left_wristData} options={options} />
      <h1>Right Shoulder Angle</h1>
      <Line data={right_shoulderData} options={options} />
      <h1>Right Wrist Angle</h1>
      <Line data={right_wristData} options={options} />
      <h1>Left Shoulder Angle</h1>
      <Line data={left_shoulderData} options={options} />
    </div>
  );
}

export default Plot;
