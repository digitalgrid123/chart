import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import * as XLSX from "xlsx";

const VerticalChart = () => {
  const [distance, setDistance] = useState([]);

  useEffect(() => {
    const excelFileURL =
      "https://webdev-vsstag-bucket.s3.eu-central-1.amazonaws.com/reports/od_1_2_2_1700656334494/chart_data.xlsx";

    fetch(excelFileURL)
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(new Uint8Array(data), { type: "array" });

        const sheetName = "visibility_percentage";
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

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: "Frame ID",
        data: values,
        backgroundColor: "#535ccd",
        borderColor: "#535ccd",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Class",
          font: {
            size: 18, // font size of y-axis title
          },
        },
        ticks: {
          font: {
            size: 15, // font size of x-axis labels
          },
          // color: "white", // font color of x-axis labels
        },
      },
      y: {
        title: {
          display: true,
          text: "Visibility Percentage",
          font: {
            size: 18, // font size of y-axis title
          },
        },
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          font: {
            size: 15, // font size of x-axis labels
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "right", // Set the position of the legend to 'top'
        align: "start", // Align the legend to the end (right)
        labels: {
          font: {
            size: 14, // Set the font size for legend labels
          },
          color: "rgba(0, 0, 0, 1)", // Set the font color for legend labels
        },
        usePointStyle: true,
        title: {
          display: true,
          text: "Variable",
          font: {
            size: 16,
            weight: "bold", // Set the font weight for the legend title
          },
          color: "black", // You can specify the color of the legend title
        },
      },
    },
  };

  return (
    <div style={{ width: "700px" }}>
      <h2>Visibility Percentage by Class</h2>
      <Bar data={chartData} options={chartOptions} height={350} />
    </div>
  );
};

export default VerticalChart;
