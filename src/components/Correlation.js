import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

function Correlation() {
  const [distance, setDistance] = useState([]);
  const [currentId, setCurrentId] = useState(1);
  useEffect(() => {
    const excelFileURL =
      "https://webdev-vsstag-bucket.s3.eu-central-1.amazonaws.com/reports/hpe_1_2_3_1701431919412/chart_data.xlsx";

    fetch(excelFileURL)
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(new Uint8Array(data), { type: "array" });

        const sheetName = "coordinates_comparision";
        const sheet = workbook.Sheets[sheetName];

        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        setDistance(sheetData);
      })
      .catch((error) => console.error("Error fetching Excel file:", error));
  }, []);

  const filteredData = distance.filter((row) => row[4] === currentId);
  const x_coordinate = filteredData.map((row) => row[1]);
  const y_coordinate = filteredData.map((row) => row[2]);

  //   const slicedFilteredData = filteredData.map((row) => row.slice(1));

  //   if (!slicedFilteredData || slicedFilteredData.length === 0) {
  //     return <div>No Person {currentId} exists with the specified ID</div>;
  //   }

  return <div>Correlation</div>;
}

export default Correlation;
