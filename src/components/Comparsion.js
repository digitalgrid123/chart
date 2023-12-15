import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function Comparison() {
  const [distance, setDistance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://webdev-vsstag-bucket.s3.eu-central-1.amazonaws.com/reports/hpe_1_2_3_1701431919412/chart_data.xlsx"
        );
        const data = await response.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(data), { type: "array" });
        const sheetName = "coordinates_comparision";
        const sheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const separatedData = separateDataByPersonAndBodyPart(sheetData);
        setDistance(separatedData);
        setLoading(false);
      } catch (error) {
        setError("Error fetching Excel file");
        console.error("Error fetching Excel file:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const separateDataByPersonAndBodyPart = (data) => {
    const separatedData = {};

    data.forEach((entry) => {
      const personId = entry[4]; // Assuming person_id is at index 4
      const bodyPart = entry[0];

      if (!separatedData[personId]) {
        separatedData[personId] = {};
      }

      if (!separatedData[personId][bodyPart]) {
        separatedData[personId][bodyPart] = { X: [], Y: [] };
      }

      separatedData[personId][bodyPart].X.push(entry[1]);
      separatedData[personId][bodyPart].Y.push(entry[2]);
    });

    return separatedData;
  };

  const createComparisonConfig = (
    personId,
    referenceBodyPart,
    targetBodyPart
  ) => {
    const series = [];

    const referenceData = distance[personId][referenceBodyPart];
    const targetData = distance[personId][targetBodyPart];

    if (referenceData && targetData) {
      series.push({
        name: referenceBodyPart,
        data: referenceData.X.map((x, index) => [x, referenceData.Y[index]]),
      });

      series.push({
        name: targetBodyPart,
        data: targetData.X.map((x, index) => [x, targetData.Y[index]]),
      });
    }

    const chartTitle = `${personId} - ${referenceBodyPart} and ${targetBodyPart} Comparison`;

    return {
      chart: {
        type: "scatter",
      },
      title: {
        text: chartTitle,
      },
      xAxis: {
        title: {
          text: "X-axis",
        },
      },
      yAxis: {
        title: {
          text: "Y-axis",
        },
      },
      series,
    };
  };

  const allComparisonCharts = [];

  Object.keys(distance).forEach((personId) => {
    const bodyParts = Object.keys(distance[personId]);

    for (let i = 0; i < bodyParts.length; i++) {
      for (let j = i + 1; j < bodyParts.length; j++) {
        const referenceBodyPart = bodyParts[i];
        const targetBodyPart = bodyParts[j];

        const config = createComparisonConfig(
          personId,
          referenceBodyPart,
          targetBodyPart
        );
        const chart = (
          <div key={`${personId}_${referenceBodyPart}_${targetBodyPart}`}>
            {/* <h2 style={{fontSize:"12px"}}>{`${personId} - ${referenceBodyPart} and ${targetBodyPart} Comparison`}</h2> */}
            <div style={{ width: "300px" }}>
              <HighchartsReact highcharts={Highcharts} options={config} />
            </div>
          </div>
        );
        allComparisonCharts.push(chart);
      }
    }
  });

  return (
    <div className="container">
      <h1 style={{ textAlign: "center" }}>All Body Part Comparisons</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="row">{!loading && !error && allComparisonCharts}</div>
    </div>
  );
}

export default Comparison;
