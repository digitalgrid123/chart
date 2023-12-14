import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsHeatmap from "highcharts/modules/heatmap";
import * as XLSX from "xlsx";

// Initialize the heatmap module
HighchartsHeatmap(Highcharts);

const Heatmap = () => {
  const [distance, setDistance] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const excelFileURL =
        "https://webdev-vsstag-bucket.s3.eu-central-1.amazonaws.com/reports/hpe_1_2_3_1701431919412/chart_data.xlsx";

      try {
        const response = await fetch(excelFileURL);
        const data = await response.arrayBuffer();

        const workbook = XLSX.read(new Uint8Array(data), { type: "array" });
        const sheetName = "correlation_matrix";
        const sheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        setDistance(sheetData);
      } catch (error) {
        console.error("Error fetching Excel file:", error);
      }
    };

    fetchData();
  }, []);

  // Check if distance is undefined or empty
  if (!distance || distance.length === 0) {
    return <div>Loading...</div>; // or any other appropriate handling
  }

  const distanceData = distance.slice(1);

  // Group data based on person_id
  const groupedData = distanceData.reduce((result, row) => {
    const personId = row[row.length - 1].toString(); // Ensure personId is treated as a string
    if (!result[personId]) {
      result[personId] = [];
    }
    result[personId].push(row);
    return result;
  }, {});

  // Convert the grouped data to separate Highcharts heatmap series
  const series = Object.entries(groupedData).map(([personId, rows]) => ({
    name: `Person ${personId}`,
    borderWidth: 1,
    data: rows.flatMap((row, rowIndex) =>
      row.slice(1, -1).map((value, colIndex) => ({
        x: colIndex,
        y: rowIndex,
        value: parseFloat(value),
      }))
    ),
  }));

  // Use labels from the first row for x and y axes
  const xCategories = distance[0].slice(1).map(String);
  const yCategories = distance[0].slice(1).map(String);

  const options = {
    chart: {
      type: "heatmap",
      marginTop: 40,
      marginBottom: 80,
    },
    title: {
      text: "Heatmap Example",
    },
    xAxis: {
      categories: xCategories,
      title: {
        text: distanceData[0][0], // Use the label from the first row as x-axis title
      },
    },
    yAxis: {
      categories: yCategories,
      title: {
        text: distanceData[0][0], // Use the label from the first row as y-axis title
      },
    },
    colorAxis: {
      min: -1, // Set the minimum value for the legend
      max: 1, // Set the maximum value for the legend
      minColor: "#0077CC", // Color for the minimum value
      maxColor: "#FF0000", // Color for the maximum value
      labels: {
        formatter: function () {
          // Format the label as needed
          return this.value === -1 ? "-0.75" : this.value.toFixed(2);
        },
      },
      tickAmount: 8, // Set the desired number of ticks
      width: 100, // Set the width of the color axis
      side: "right", // Place the color axis on the right side
    },
    plotOptions: {
      heatmap: {
        dataLabels: {
          enabled: true,
          color: "#000000", // Set the color of the data labels
          format: "{point.value:.2f}", // Display values with two decimal points
        },
      },
    },
  };

  return (
    <div>
      {/* Dynamically render HighchartsHeatmap for each series */}
      {series.map((singleSeries, index) => (
        <HighchartsReact
          key={index}
          highcharts={Highcharts}
          options={{ ...options, series: [singleSeries] }}
        />
      ))}
    </div>
  );
};

export default Heatmap;
