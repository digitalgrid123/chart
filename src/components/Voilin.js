import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

function Voilin() {
  const [distance, setDistance] = useState([]);
  const [personData, setPersonData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const excelFileURL =
        "https://webdev-vsstag-bucket.s3.eu-central-1.amazonaws.com/reports/hpe_1_2_3_1701431919412/chart_data.xlsx";

      try {
        const response = await fetch(excelFileURL);
        const data = await response.arrayBuffer();

        const workbook = XLSX.read(new Uint8Array(data), { type: "array" });
        const sheetName = "distance_violin";
        const sheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        setDistance(sheetData);

        // Find person_id column index
        const headerRow = sheetData[0];
        const personIdColumnIndex = headerRow.indexOf("person_id");

        if (personIdColumnIndex !== -1) {
          // person_id found in the header row
          const personDataMap = {};

          sheetData.slice(1).forEach((rowData) => {
            const personIdValue = rowData[personIdColumnIndex];

            if (!personDataMap[personIdValue]) {
              // Create a new object for the person_id with dynamically generated arrays
              personDataMap[personIdValue] = {
                person_id: personIdValue,
              };

              // Dynamically generate arrays for each distance type
              headerRow.forEach((distanceType, index) => {
                if (index !== personIdColumnIndex) {
                  personDataMap[personIdValue][distanceType] = [];
                }
              });
            }

            // Add data to the respective arrays
            headerRow.forEach((distanceType, index) => {
              if (index !== personIdColumnIndex) {
                personDataMap[personIdValue][distanceType].push(rowData[index]);
              }
            });
          });

          setPersonData(personDataMap);
          console.log("Data separated based on person_id:", personDataMap);
        } else {
          console.error("Person ID column not found in the header row.");
        }
      } catch (error) {
        console.error("Error fetching Excel file:", error);
      }
    };

    fetchData();
  }, []);

  console.log(distance);

  return (
    <div>
      <h1>Violin Chart Data</h1>
      {Object.values(personData).map((person) => (
        <div key={person.person_id}>
          <h2>Person ID: {person.person_id}</h2>
          <ul>
            {Object.entries(person)
              .filter(
                ([key, value]) => key !== "person_id" && Array.isArray(value)
              )
              .map(([distanceType, distanceArray]) => (
                <li key={distanceType}>
                  <strong>{distanceType}:</strong>{" "}
                  {JSON.stringify(distanceArray)}
                </li>
              ))}
          </ul>
        </div>
      ))}
      <pre>{JSON.stringify(distance, null, 2)}</pre>
    </div>
  );
}

export default Voilin;
