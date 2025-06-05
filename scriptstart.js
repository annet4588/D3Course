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
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load and process the data
d3.csv("jdi_data_daily.csv").then(function(data){
    // Parse the date and convert the population to a number
    const parseDate = d3.timeParse("%Y-%m-%d");
    data.forEach(d => {
        d.date = parseDate(d.date);
        d.population = +d.population;
    });
    
    console.log(data);
});


//Define x and y domains
x.domain(d3.extent(dataset, d => d.date)); // Include all the dates from the dataset
y.domain([0, d3.max(dataset, d => d.value)]); //The rangle starts from 0 and up to the max value that's in the dataset 

// Add x-axis
svg.append("g")
  .attr("transform", `translate(0, ${height})`) // Moves(translates) the x-axis group element to the bottom of the chart
  .call(d3.axisBottom(x)
    .ticks(d3.timeMonth.every(1))         // Format how many ticks/what interval
    .tickFormat(d3.timeFormat("%b %Y"))); // How tick labels displayed

// Add y-axis
svg.append("g")
  .call(d3.axisLeft(y))

// Create line generator that maps each data point to an x and y position based on the scales
const line = d3.line()
  .x(d => x(d.date)) // Use the x scale to position dates
  .y(d => y(d.value)); // Use the y scale to position values

// Add line path to SVG element
svg.append("path")
  .datum(dataset)  // Binds the dataset to the path
  .attr("fill", "none")  // No fill under the line
  .attr("stroke", "steelblue") // Set the line color
  .attr("stroke-width", 1) // Sets the thickness of the line
  .attr("d", line); // Use the line generator to create the path