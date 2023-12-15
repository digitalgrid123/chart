import React, { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import * as XLSX from "xlsx";

function Sign() {
  const [personData, setPersonData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const excelFileURL =
        "https://webdev-vsstag-bucket.s3.eu-central-1.amazonaws.com/reports/hpe_1_2_3_1701431919412/chart_data.xlsx";

      try {
        const response = await fetch(excelFileURL);
        const data = await response.arrayBuffer();

        const workbook = XLSX.read(new Uint8Array(data), { type: "array" });
        const sheetName = "distance_comparison";
        const sheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const headerRow = sheetData[0];
        const personIdColumnIndex = headerRow.indexOf("person_id");

        if (personIdColumnIndex !== -1) {
          const personDataMap = {};

          sheetData.slice(1).forEach((rowData) => {
            const personIdValue = rowData[personIdColumnIndex];

            if (!personDataMap[personIdValue]) {
              personDataMap[personIdValue] = {
                person_id: personIdValue,
              };

              headerRow.forEach((distanceType, index) => {
                if (index !== personIdColumnIndex) {
                  personDataMap[personIdValue][distanceType] = [];
                }
              });
            }

            headerRow.forEach((distanceType, index) => {
              if (index !== personIdColumnIndex) {
                personDataMap[personIdValue][distanceType].push(rowData[index]);
              }
            });
          });

          setPersonData(personDataMap);
        } else {
          console.error("Person ID column not found in the header row.");
        }
      } catch (error) {
        console.error("Error fetching Excel file:", error);
      }
    };

    fetchData();
  }, []);

  const frameIds = personData[1]?.frame_id || [];

  // Get all person IDs
  const personIds = Object.keys(personData);

  return (
    <div>
      {personIds.map((personId) => {
        const categories = Object.keys(personData[personId] || {}).filter(
          (category) => category !== "frame_id"
        );

        // Filter out categories with empty data
        const nonEmptyCategories = categories.filter(
          (category) => personData[personId][category]?.length > 0
        );

        if (nonEmptyCategories.length === 0) {
          return null; // Skip rendering if there are no non-empty categories
        }

        return (
          <div key={personId}>
            <h2>{`Person ${personId} Charts`}</h2>
            {nonEmptyCategories.map((category) => {
              const categoryData = personData[personId][category];

              // Generate a random color for the series
              const randomColor = `#${Math.floor(
                Math.random() * 16777215
              ).toString(16)}`;

              const options = {
                chart: {
                  type: "line",
                },
                title: {
                  text: `${category} Chart`,
                },
                xAxis: {
                  title: {
                    text: "Frame ID",
                  },
                  categories: frameIds,
                },
                yAxis: {
                  title: {
                    text: "Value",
                  },
                },
                series: [
                  {
                    name: category,
                    data: categoryData,
                    color: randomColor,
                    connectNulls: true,
                  },
                ],
              };

              return (
                <div className="container">
                  <div className="row">
                    <div
                      key={`${personId}-${category}`}
                      style={{
                        // width: "400px",
                        display: "flex",
                      }}
                    >
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={options}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default Sign;
