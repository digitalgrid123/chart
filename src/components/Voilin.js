import React, { useEffect, useRef } from "react";
import Plotly from "plotly.js/lib/core";
// import "plotly.js/dist/plotly.css";

const ViolinPlot = () => {
  const plotRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/plotly/datasets/master/violin_data.csv"
        );
        const csvData = await response.text();

        const rows = Plotly.d3.csv.parse(csvData);

        function unpack(rows, key) {
          return rows.map(function (row) {
            return row[key];
          });
        }

        const data = [
          {
            type: "violin",
            y: unpack(rows, "total_bill"),
            points: "none",
            box: {
              visible: true,
            },
            boxpoints: false,
            line: {
              color: "black",
            },
            fillcolor: "#8dd3c7",
            opacity: 0.6,
            meanline: {
              visible: true,
            },
            x0: "Total Bill",
          },
        ];

        const layout = {
          title: "",
          yaxis: {
            zeroline: false,
          },
        };

        Plotly.newPlot(plotRef.current, data, layout);
      } catch (error) {
        console.error("Error fetching or parsing data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Violin Plot</h2>
      <div ref={plotRef}></div>
    </div>
  );
};

export default ViolinPlot;
