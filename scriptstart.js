// Set dimentions and margins for the chart
const margin = {top: 70, right: 30, bottom:40, left: 80};
const width = 1200 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Set up x and y scales
const x = d3.scaleTime()
   .range([0, width]); // From 0 to the width

const y = d3.scaleLinear()
   .range([height, 0]);

   // Create SVG element and append it to the chart container
   const svg = d3.select("#chart-container") 
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("tranform", `translate(${margin.left}, ${margin.top})`);



