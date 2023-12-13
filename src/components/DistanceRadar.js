import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Radar } from "react-chartjs-2";

function DistanceRadar() {
  const [distanceData, setDistanceData] = useState([]);
  const [currentId, setCurrentId] = useState(1);
  const [confidenceData, setConfidenceData] = useState([]);

  useEffect(() => {
    const excelFileURL =
      "https://webdev-vsstag-bucket.s3.eu-central-1.amazonaws.com/reports/hpe_1_2_3_1701431919412/chart_data.xlsx";

    fetch(excelFileURL)
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(new Uint8Array(data), { type: "array" });

        // Read data from the "distance" sheet
        const distanceSheetName = "distance_radar";
        const distanceSheet = workbook.Sheets[distanceSheetName];
        const distanceSheetData = XLSX.utils.sheet_to_json(distanceSheet, {
          header: 1,
        });
        setDistanceData(distanceSheetData);

        const confidenceSheetName = "speed_radar";
        const confidenceSheet = workbook.Sheets[confidenceSheetName];
        const confidenceSheetData = XLSX.utils.sheet_to_json(confidenceSheet, {
          header: 1,
        });
        setConfidenceData(confidenceSheetData);
      })
      .catch((error) => console.error("Error fetching Excel file:", error));
  }, []);

  const distanceName = distanceData[0] || [];
  const distance = distanceData.slice(1);

  const filteredData = distance.filter((row) => row[6] === currentId);
  const slicedFilteredData = filteredData[0]?.slice(0, -1);

  if (!slicedFilteredData || slicedFilteredData.length === 0) {
    return <div>No Person {currentId} exists with the specified ID</div>;
  }

  const confidenceName = confidenceData[0] || [];
  const confidence = confidenceData.slice(1);
  const averagefilterData = confidence.filter((row) => row[6] === currentId);
  const slicedaverageFilteredData = averagefilterData[0]?.slice(0, -1);

  if (!slicedaverageFilteredData || slicedaverageFilteredData.length === 0) {
    return <div>No Person {currentId} exists with the specified ID</div>;
  }

  const data = {
    labels: distanceName.slice(0, -1),
    datasets: [
      {
        label: "Values",
        data: slicedFilteredData,
        backgroundColor: "rgba(57, 63, 132, 0.2)",
        borderColor: "rgba(57, 63, 132, 1)",
        borderWidth: 1,
      },
    ],
  };
  const average_velocity = {
    labels: confidenceName.slice(0, -1),
    datasets: [
      {
        label: "Values",
        data: slicedaverageFilteredData,
        backgroundColor: "rgba(57, 63, 132, 0.2)",
        borderColor: "rgba(57, 63, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        min: 0,
        max: 2500,
        pointLabels: {
          font: {
            size: 15,
          },
        },
        ticks: {
          stepSize: 500, // Set the step size between ticks
          beginAtZero: true,
          maxTicksLimit: 8,
        },
        grid: {
          circular: true,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  const averageoptions = {
    scales: {
      r: {
        min: 0,
        max: 500,
        pointLabels: {
          font: {
            size: 15,
          },
        },
        ticks: {
          stepSize: 100, // Set the step size between ticks
          beginAtZero: true,
          maxTicksLimit: 8,
        },
        grid: {
          circular: true,
        },
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
      <h2>Average Velocity for Instruments with High Means Confidence</h2>
      <div className="w-700">
        <Radar data={data} options={options} />
        <Radar data={average_velocity} options={averageoptions} />
      </div>
    </>
  );
}

export default DistanceRadar;
