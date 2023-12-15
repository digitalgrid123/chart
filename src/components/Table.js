import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const YourComponent = () => {
  const [distanceData, setDistanceData] = useState([]);
  const [confidenceData, setConfidenceData] = useState([]);
  const [personIds, setPersonIds] = useState([]);

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

        // Read data from the "stats_summary" sheet
        const confidenceSheetName = "stats_summary";
        const confidenceSheet = workbook.Sheets[confidenceSheetName];
        const confidenceSheetData = XLSX.utils.sheet_to_json(confidenceSheet, {
          header: 1,
        });
        setConfidenceData(confidenceSheetData);

        // Extract unique person IDs
        const uniquePersonIds = new Set(
          confidenceSheetData.slice(1).map((row) => row[9])
        );
        setPersonIds(Array.from(uniquePersonIds));
      })
      .catch((error) => console.error("Error fetching Excel file:", error));
  }, []);

  const renderTables = () => {
    return personIds.map((personId) => {
      const filteredData = confidenceData.filter((row) => row[9] === personId);

      if (!filteredData || filteredData.length === 0) {
        return (
          <div key={personId}>
            <h2>No data available for Person {personId}</h2>
          </div>
        );
      }

      return (
        <div key={personId}>
          <h4>Person {personId}</h4>
          <table border={1}>
            <thead>
              {confidenceData[0]?.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
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
        </div>
      );
    });
  };

  return (
    <>
      <h4>Video Attribute</h4>
      <table border={1}>
        <thead>
          {distanceData[0]?.map((key, index) => (
            <th key={index}>{key}</th>
          ))}
        </thead>
        <tbody>
          {distanceData.slice(1)?.map((row, index) => (
            <tr key={index} style={{ textAlign: "center" }}>
              {row.map((value, cellIndex) => (
                <td key={cellIndex}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {renderTables()}
    </>
  );
};

export default YourComponent;
