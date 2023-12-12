import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import * as XLSX from "xlsx";

const BarChart = () => {
  const [distance, setDistance] = useState([]);
  const [scissorsArray, setScissorsArray] = useState([]);
  const [springForcepsArray, setSpringForcepsArray] = useState([]);

  useEffect(() => {
    const excelFileURL =
      "https://webdev-vsstag-bucket.s3.eu-central-1.amazonaws.com/reports/od_1_2_2_1700656334494/chart_data.xlsx";

    fetch(excelFileURL)
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(new Uint8Array(data), { type: "array" });

        const sheetName = "instrument_confidence";
        const sheet = workbook.Sheets[sheetName];

        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        setDistance(sheetData);
      })
      .catch((error) => console.error("Error fetching Excel file:", error));
  }, []);

  useEffect(() => {
    if (distance.length > 0) {
      distance.splice(0, 1);
    }

    const springForcepsData = distance.filter(
      (row) => row[0] === "Spring Forceps"
    );
    const scissorsData = distance.filter((row) => row[0] === "Scissors");

    setScissorsArray(scissorsData);
    setSpringForcepsArray(springForcepsData);
  }, [distance]);

  const prepareChartData = (data) => {
    const valueCountMap = {};

    data.forEach((item) => {
      const value = item[1];

      if (valueCountMap[value]) {
        valueCountMap[value]++;
      } else {
        valueCountMap[value] = 1;
      }
    });

    const chartData = [];
    for (const [value, count] of Object.entries(valueCountMap)) {
      chartData.push({ x: parseFloat(value), y: count });
    }

    return chartData;
  };

  const chartData = {
    datasets: [
      {
        label: "Scissor",
        data: prepareChartData(scissorsArray),
        backgroundColor: "#535ccd",
      },
      {
        label: "Spring Forceps",
        data: prepareChartData(springForcepsArray),
        backgroundColor: "#ef553b",
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        max: 1,
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
        },
        title: {
          display: true,
          text: "Confidence",
          font: {
            size: 16, // font size of x-axis title
            weight: "bold", // font weight of x-axis title
          },
        },
        grid: {
          drawBorder: false,
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        max: 150,
        ticks: {
          stepSize: 50,
        },
        title: {
          display: true,
          text: "Count",
          font: {
            size: 16, // font size of x-axis title
            weight: "bold", // font weight of x-axis title
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
      },
    },
  };

  return (
    <>
      <h2>Instrument Confidence Histogram</h2>
      <div className="w-700 chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </>
  );
};

export default BarChart;
