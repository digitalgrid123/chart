import React, { useState, useEffect } from "react";
import { Radar } from "react-chartjs-2";
import * as XLSX from "xlsx";

const RadarChart = () => {
  const [distance, setDistance] = useState([]);

  useEffect(() => {
    const excelFileURL =
      "https://webdev-vsstag-bucket.s3.eu-central-1.amazonaws.com/reports/od_1_2_2_1700656334494/chart_data.xlsx";

    fetch(excelFileURL)
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(new Uint8Array(data), { type: "array" });

        const sheetName = "average_velocity";
        const sheet = workbook.Sheets[sheetName];

        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        setDistance(sheetData);
      })
      .catch((error) => console.error("Error fetching Excel file:", error));
  }, []);

  const categories = distance.slice(1).map((row) => row[0]); // Extracting category names
  const values = distance
    .slice(1)
    .map((row) => Math.floor(parseFloat(row[1]) * 10) / 10); // Extracting values

  const data = {
    labels: categories,
    datasets: [
      {
        label: "Values",
        data: values,
        backgroundColor: "rgba(57,63,132,0.2)",
        borderColor: "rgba(57,63,132,1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        min: 0,
        max: 120,
        pointLabels: {
          font: {
            size: 15,
          },
        },
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 8,
        },
        grid: {
          circular: true,
        },

        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <>
      <h2>Average Velocity for instruments with high means confidence</h2>
      <div className="w-700">
        <Radar data={data} options={options} />
      </div>
    </>
  );
};

export default RadarChart;
