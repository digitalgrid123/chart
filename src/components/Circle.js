import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Chart from "chart.js/auto";

function Circle() {
  const [distance, setDistance] = useState([]);

  useEffect(() => {
    const excelFileURL =
      "https://webdev-vsstag-bucket.s3.eu-central-1.amazonaws.com/reports/od_1_2_2_1700656334494/chart_data.xlsx";

    fetch(excelFileURL)
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(new Uint8Array(data), { type: "array" });

        const sheetName = "instruments_distance";
        const sheet = workbook.Sheets[sheetName];

        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        setDistance(sheetData);
      })
      .catch((error) => console.error("Error fetching Excel file:", error));
  }, []);

  // Processed data
  const disData = distance.reduce(
    (accumulator, dis) => {
      const lowercaseValue = dis[0].toLowerCase();
      if (lowercaseValue === "scissors") {
        accumulator.scissorsData.push({ x: "Scissors", y: dis[1] });
      } else if (lowercaseValue === "spring forceps") {
        accumulator.springForcepsData.push({ x: "Spring Forceps", y: dis[1] });
      }
      return accumulator;
    },
    { scissorsData: [], springForcepsData: [] }
  );

  useEffect(() => {
    const ctx = document.getElementById("scatterChart").getContext("2d");
    let myChart = null;

    if (myChart) {
      myChart.destroy();
    }
    myChart = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Scissors Data",
            data: disData.scissorsData,
            backgroundColor: "#535ccd",
            pointRadius: 40, // Adjust the size as needed
          },
          {
            label: "Spring Forceps Data",
            data: disData.springForcepsData,
            backgroundColor: "#ef553b",
            pointRadius: 40, // Adjust the size as needed
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: "category",
            labels: ["", "Scissors", "", "", "", "Spring Forceps", ""],
          },

          y: {
            title: {
              display: true,
              text: "Distance",
              font: {
                size: 16,
              },
            },
            min: 250,
            beginAtZero: true,
            max: 550,
            stepSize: 50,
          },
        },
        elements: {
          point: {
            radius: 11, // Adjust the size as needed
          },
        },
      },
    });
    return () => {
      if (myChart) {
        myChart.destroy();
      }
    };
  }, [disData]);

  return (
    <div className="w-700">
      <canvas id="scatterChart" width="500" height="400"></canvas>
    </div>
  );
}

export default Circle;
