import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Chart from "react-apexcharts";

function DistanceRadar() {
  const [distanceData, setDistanceData] = useState([]);
  const [confidenceData, setConfidenceData] = useState([]);

  useEffect(() => {
    const excelFileURL =
      "https://webdev-vsstag-bucket.s3.eu-central-1.amazonaws.com/reports/hpe_1_2_3_1701431919412/chart_data.xlsx";

    fetch(excelFileURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch Excel file. Status: ${response.status}`
          );
        }
        return response.arrayBuffer();
      })
      .then((data) => {
        const workbook = XLSX.read(new Uint8Array(data), { type: "array" });

        // Read data from the "distance" sheet
        const distanceSheetName = "distance_radar";
        const distanceSheet = workbook.Sheets[distanceSheetName];
        const distanceSheetData = XLSX.utils.sheet_to_json(distanceSheet, {
          header: 1,
        });
        setDistanceData(distanceSheetData);

        // Read data from the "speed" sheet
        const confidenceSheetName = "speed_radar";
        const confidenceSheet = workbook.Sheets[confidenceSheetName];
        const confidenceSheetData = XLSX.utils.sheet_to_json(confidenceSheet, {
          header: 1,
        });
        setConfidenceData(confidenceSheetData);
      })
      .catch((error) =>
        console.error("Error fetching or processing Excel file:", error)
      );
  }, []);

  const distanceName = distanceData[0] || [];
  const distance = distanceData.slice(1);

  const confidenceName = confidenceData[0] || [];
  const confidence = confidenceData.slice(1);

  const personIds = distance.map((row) => row[6]); // Assuming person_id is in the 7th column

  const renderCharts = () => {
    return personIds.map((personId, index) => {
      const filteredDistanceData = distance.filter(
        (row) => row[6] === personId
      );
      const slicedFilteredDistanceData = filteredDistanceData[0]?.slice(0, -1);

      const filteredConfidenceData = confidence.filter(
        (row) => row[6] === personId
      );
      const slicedFilteredConfidenceData = filteredConfidenceData[0]?.slice(
        0,
        -1
      );

      if (
        !slicedFilteredDistanceData ||
        slicedFilteredDistanceData.length === 0 ||
        !slicedFilteredConfidenceData ||
        slicedFilteredConfidenceData.length === 0
      ) {
        return (
          <div key={index}>
            <h2>No data available for Person {personId}</h2>
          </div>
        );
      }

      const labels = distanceName.slice(0, -1);

      const distanceChartData = {
        labels,
        series: [
          {
            name: `Person ${personId} - Distance`,
            data: slicedFilteredDistanceData,
            labels,
          },
        ],
      };

      const confidenceChartData = {
        labels,
        series: [
          {
            name: `Person ${personId} - Confidence`,
            data: slicedFilteredConfidenceData,
            labels,
          },
        ],
      };

      const options = {
        chart: {
          type: "radar",
          toolbar: {
            show: false,
          },
        },
        yaxis: {
          min: 0,
          max: 2500,
          labels: {
            style: {
              fontSize: "15px",
            },
          },
          tickAmount: 8,
        },
        grid: {
          circular: true,
        },
        legend: {
          show: true,
        },
        tooltip: {
          x: {
            show: true,
            formatter: (value) => labels[value],
          },
        },
        colors: ["#008FFB", "#00E396"], // Add custom colors for distance and confidence series
      };

      return (
        <div key={index}>
          <h2>Charts for Person {personId}</h2>
          <div className="w-700">
            <h5>Total Distance covered by top six significant body parts</h5>
            <Chart
              options={options}
              series={distanceChartData.series}
              type="radar"
            />
          </div>
          <div className="w-700">
            <h5>Averate Speed of top six signigicant body parts</h5>
            <Chart
              options={options}
              series={confidenceChartData.series}
              type="radar"
            />
          </div>
        </div>
      );
    });
  };

  return <>{renderCharts()}</>;
}

export default DistanceRadar;
