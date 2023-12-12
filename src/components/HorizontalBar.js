import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";
import * as XLSX from "xlsx";

const BarChart = () => {
  const [distance, setDistance] = useState([]);

  useEffect(() => {
    const excelFileURL =
      "https://webdev-vsstag-bucket.s3.eu-central-1.amazonaws.com/reports/od_1_2_2_1700656334494/chart_data.xlsx";

    fetch(excelFileURL)
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(new Uint8Array(data), { type: "array" });

        const sheetName = "sorted_confidence";
        const sheet = workbook.Sheets[sheetName];

        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        setDistance(sheetData);
      })
      .catch((error) => console.error("Error fetching Excel file:", error));
  }, []);

  const categories = distance.slice(1).map((row) => row[0]); // Extracting country names
  const values = distance
    .slice(1)
    .map((row) => Math.floor(parseFloat(row[1]) * 10) / 10);

  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
      horizontalAlign: "left",
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
      dataLabels: {
        enabled: false, // Set to false to hide the values on top of bars
      },
    },
    xaxis: {
      max: 1,
      tickAmount: 5,

      categories: categories,
      labels: {
        formatter: function (val) {
          return val.toFixed(1);
        },
      },
      title: {
        text: "Instrument ID",
      },
    },
    yaxis: {
      title: {
        text: "Confidence",
      },
    },
  };

  const chartSeries = [
    {
      name: "Values",
      data: values,
      dataLabels: {
        enabled: false, // Disable data labels
      },
      color: "#87ceeb", // Set the color of the bars
    },
  ];

  return (
    <>
      <h2>Sorted Confidence for Each Unique Instrument</h2>
      <ApexCharts
        options={chartOptions}
        series={chartSeries}
        type="bar"
        width={700}
        height={350}
      />
    </>
  );
};

export default BarChart;
