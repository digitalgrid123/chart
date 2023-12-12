import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Line } from "react-chartjs-2";

const CustomLegend = ({ color, label }) => (
  <div style={{ display: "flex", alignItems: "center", marginRight: "10px" }}>
    <div
      style={{
        width: "10px",
        height: "10px",
        backgroundColor: color,
        marginRight: "5px",
      }}
    ></div>
    {label}
  </div>
);

function LineGraph() {
  const [distance, setDistance] = useState([]);
  const [scissorsArray, setScissorsArray] = useState([]);
  const [springForcepsArray, setSpringForcepsArray] = useState([]);
  const [oth, setOtherArray] = useState([]);

  useEffect(() => {
    const excelFileURL =
      "https://webdev-vsstag-bucket.s3.eu-central-1.amazonaws.com/reports/od_1_2_2_1700656334494/chart_data.xlsx";

    fetch(excelFileURL)
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(new Uint8Array(data), { type: "array" });

        const sheetName = "velocity_line_graphs";
        const sheet = workbook.Sheets[sheetName];

        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        setDistance(sheetData);
      })
      .catch((error) => console.error("Error fetching Excel file:", error));
  }, []);

  useEffect(() => {
    // Update the state with the new array
    let newArray = distance.slice(1);
    setScissorsArray(newArray.filter((row) => row[3] === "Scissors_1"));
    setSpringForcepsArray(
      newArray.filter((row) => row[3] === "Spring Forceps_2")
    );
    setOtherArray(
      newArray.filter(
        (row) => row[3] !== "Scissors_1" && row[3] !== "Spring Forceps_2"
      )
    );
  }, [distance]);

  const xValuesScissors = scissorsArray.map((row) => row[1]);
  const yValuesScissors = scissorsArray.map((row) => row[2]);

  const xValuesSpringForceps = springForcepsArray.map((row) => row[1]);
  const yValuesSpringForceps = springForcepsArray.map((row) => row[2]);

  const xValuesOther = oth.map((row) => row[1]);
  const yValuesOther = oth.map((row) => row[2]);

  const dataScissors = {
    labels: xValuesScissors,
    datasets: [
      {
        label: "Scissors_1",
        data: yValuesScissors,
        fill: false,
        borderColor: "#535ccd",
      },
    ],
  };

  const dataSpringForceps = {
    labels: xValuesSpringForceps,
    datasets: [
      {
        label: "Spring Forceps_2",
        data: yValuesSpringForceps,
        fill: false,
        borderColor: "#ef553b",
      },
    ],
  };

  const dataOther = {
    labels: xValuesOther,
    datasets: [
      {
        label: "Other",
        data: yValuesOther,
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
        max: 140,
        ticks: {
          beginAtZero: 0,
          maxTicksLimit: 6,
        },
      },
      y: {
        title: {
          display: true,
          text: "Scissors_1",
          font: {
            size: 16,
          },
        },
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 4,
        },
      },
    },
    plugins: { legend: { display: false } },
  };

  const optionsSpringForceps = {
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
        max: 60,
        ticks: {
          beginAtZero: 0,
          maxTicksLimit: 6,
        },
      },
      y: {
        title: {
          display: true,
          text: "Spring Forceps_2",
          font: {
            size: 16,
          },
        },
        min: 0,
        max: 400,
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 4,
        },
      },
    },
    plugins: { legend: { display: false } },
  };

  const optionsOther = {
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
        max: 140,
        ticks: {
          beginAtZero: 0,
          maxTicksLimit: 6,
        },
      },
      y: {
        title: {
          display: true,
          text: "Spring Forceps_4",
          font: {
            size: 16,
          },
        },
        min: 0,
        max: 600,
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
      <h1>Velocity Line Graphs</h1>
      <div style={{ display: "flex", marginBottom: "10px" }}>
        <CustomLegend color="#535ccd" label="Scissors_1" />
        <CustomLegend color="#ef553b" label="Spring Forceps_2" />
        <CustomLegend color="#00be8c" label="Other" />
      </div>
      <Line data={dataScissors} options={options} />
      <Line data={dataSpringForceps} options={optionsSpringForceps} />
      <Line data={dataOther} options={optionsOther} />
    </div>
  );
}

export default LineGraph;
