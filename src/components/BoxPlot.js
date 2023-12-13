import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Chart from "react-apexcharts";

const BodyMovementComparison = () => {
  const [distance, setDistance] = useState([]);
  const [currentId, setCurrentId] = useState(1);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const excelFileURL =
        "https://webdev-vsstag-bucket.s3.eu-central-1.amazonaws.com/reports/hpe_1_2_3_1701431919412/chart_data.xlsx";

      try {
        const response = await fetch(excelFileURL);
        const data = await response.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(data), { type: "array" });

        const sheetName = "box_plots";
        const sheet = workbook.Sheets[sheetName];

        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        setDistance(sheetData);
      } catch (error) {
        console.error("Error fetching Excel file:", error);
      }
    };

    fetchData();
  }, []);

  const renderFilteredData = () => {
    if (!distance || distance.length === 0) {
      return <div>Loading...</div>;
    }

    const filteredData = distance.filter((row) => row[17] === currentId);
    if (!filteredData || filteredData.length === 0) {
      return <div>No Person {currentId} exist ID</div>;
    }

    const chartOptions = (title, dataIndex) => {
      return {
        chart: {
          type: "boxPlot",
        },
        xaxis: {
          type: "category",
          categories: distance[dataIndex] ? distance[0][dataIndex] : [],
        },

        yaxis: {
          min: 0,
          max: 40,
          tickAmount: 5,
          labels: {
            formatter: function (value) {
              return value.toFixed(1);
            },
          },
        },
      };
    };

    const chartSeries = (dataIndex) => {
      return [
        {
          name: "Box Plot",
          data: [
            {
              x: filteredData[dataIndex] ? filteredData[0][dataIndex] : [],
              y:
                filteredData.length > 1
                  ? filteredData
                      .slice(1)
                      .map((row) =>
                        row[dataIndex] ? parseFloat(row[dataIndex]) : 0
                      )
                  : [],
            },
          ],
        },
      ];
    };
    const chartComponents = [
      { title: "Left Ankle", dataIndex: 15 },
      { title: "Right Ankle", dataIndex: 16 },
      { title: "Left Knee", dataIndex: 13 },
      { title: "Right Knee", dataIndex: 14 },
      { title: "Left Hip", dataIndex: 11 },
      { title: "Right Hip", dataIndex: 12 },
      { title: "Left Wrist", dataIndex: 9 },
      { title: "Right Wrist", dataIndex: 10 },
      { title: "Left Elbow", dataIndex: 7 },
      { title: "Right Elbow", dataIndex: 8 },
      { title: "Left Shoulder", dataIndex: 5 },
      { title: "Right Shoulder", dataIndex: 6 },
      { title: "Left Ear", dataIndex: 3 },
      { title: "Right Ear", dataIndex: 4 },
      { title: "Left Eye", dataIndex: 1 },
      { title: "Right Eye", dataIndex: 2 },
      { title: "Nose", dataIndex: 0 },
    ];

    return (
      <div className="container">
        <h2 key={currentId}>Body Movement Comparison - ID {currentId}</h2>
        <div className="row">
          {chartComponents.map((chart, index) => (
            <div className="col-lg-4" key={index}>
              <Chart
                options={chartOptions(chart.title, chart.dataIndex)}
                series={chartSeries(chart.dataIndex)}
                type="boxPlot"
                width={350}
                height={350}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderFilteredData()}
      {currentId < distance?.length && (
        <button
          onClick={() => setCurrentId((prevId) => prevId + 1)}
          style={{ position: "absolute", top: "0", left: "50%" }}
        >
          Next ID
        </button>
      )}
    </div>
  );
};

export default BodyMovementComparison;
