import React, { useState, useEffect } from "react";
import { Scatter } from "react-chartjs-2";
import * as XLSX from "xlsx";

function ProximityMap() {
  const [distance, setDistance] = useState([]);
  const [item, setItem] = useState([]);
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

        const sheetName = "proximity_map";
        const sheet = workbook.Sheets[sheetName];

        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        setDistance(sheetData);
      })
      .catch((error) => console.error("Error fetching Excel file:", error));
  }, []);

  useEffect(() => {
    // Update the state with the new array
    let newArray = distance.slice(1);
    setItem(newArray);

    // Filter arrays based on item[0] values
    const scissorsData = newArray.filter((row) => row[0] === "Scissors_1");
    const springForcepsData = newArray.filter(
      (row) => row[0] === "Spring Forceps_2"
    );

    // Store items that do not match in the 'oth' array
    const otherData = newArray.filter(
      (row) => row[0] !== "Scissors_1" && row[0] !== "Spring Forceps_2"
    );

    setScissorsArray(scissorsData);
    setSpringForcepsArray(springForcepsData);
    setOtherArray(otherData);
  }, [distance]);

  const scatterData = {
    datasets: [
      {
        label: "Scissors",
        data: scissorsArray.map((row) => ({ x: row[1], y: row[2] })),
        backgroundColor: "#ef553b",
      },
      {
        label: "Spring Forceps_2",
        data: springForcepsArray.map((row) => ({ x: row[1], y: row[2] })),
        backgroundColor: "#00be8c",
      },
      {
        label: "Spring Forceps_4",
        data: oth.map((row) => ({ x: row[1], y: row[2] })),
        backgroundColor: "#535ccd",
      },
    ],
  };

  const scatterOptions = {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "X Coordinate",
        },
        min: 400, // Set your desired minimum value
        max: 1000, // Set your desired maximum value
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 6,
          stepSize: 20,
        },
      },
      y: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "X Coordinate",
        },
        min: 300, // Set your desired minimum value
        max: 400, // Set your desired maximum value
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 6,
          stepSize: 20,
        },
      },
    },
  };

  return (
    <div className="w-700">
      <Scatter data={scatterData} options={scatterOptions} />
    </div>
  );
}

export default ProximityMap;
