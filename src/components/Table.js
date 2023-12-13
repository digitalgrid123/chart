import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const YourComponent = () => {
  const [distanceData, setDistanceData] = useState([]);
  const [currentId, setCurrentId] = useState(2);
  const [confidenceData, setConfidenceData] = useState([]);

  useEffect(() => {
    const excelFileURL =
      "https://webdev-vsstag-bucket.s3.eu-central-1.amazonaws.com/reports/hpe_1_2_3_1701431919412/chart_data.xlsx";

    fetch(excelFileURL)
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(new Uint8Array(data), { type: "array" });

        // Read data from the "distance" sheet
        const distanceSheetName = "table_df";
        const distanceSheet = workbook.Sheets[distanceSheetName];
        const distanceSheetData = XLSX.utils.sheet_to_json(distanceSheet, {
          header: 1,
        });
        setDistanceData(distanceSheetData);

        const confidenceSheetName = "stats_summary";
        const confidenceSheet = workbook.Sheets[confidenceSheetName];
        const confidenceSheetData = XLSX.utils.sheet_to_json(confidenceSheet, {
          header: 1,
        });
        setConfidenceData(confidenceSheetData);
      })
      .catch((error) => console.error("Error fetching Excel file:", error));
  }, []);
  const distance = distanceData.slice(1);
  const keys = distance.map(([key]) => key);
  const values = distance.map(([, value]) => value);

  const confidenceHeaders = confidenceData[0] || [];
  const confidence = confidenceData.slice(1) || [];

  const filteredData = confidenceData.filter((row) => row[9] === currentId);
  if (!filteredData || filteredData.length === 0) {
    return <div>No Person {currentId} exist ID</div>;
  }

  return (
    <>
      <h4>Video Attribute</h4>
      {distance.length > 0 && (
        <table border={1}>
          <thead>
            {keys?.map((key, index) => {
              return <th key={index}>{key}</th>;
            })}
          </thead>
          <tbody>
            {values?.map((value, index) => {
              return (
                <td style={{ textAlign: "center" }} key={index}>
                  {value}
                </td>
              );
            })}
          </tbody>
        </table>
      )}

      <h4>Person 1</h4>
      <table border={1}>
        <thead>
          {confidenceHeaders.map((header, index) => {
            return <th key={index}>{header}</th>;
          })}
        </thead>
        <tbody>
          {filteredData.map((rowData, rowIndex) => (
            <tr key={rowIndex} style={{ textAlign: "center" }}>
              {rowData.map((cellData, cellIndex) => (
                <td key={cellIndex}>{cellData}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default YourComponent;
