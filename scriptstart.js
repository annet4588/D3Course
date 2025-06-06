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

//Define x and y domains
x.domain(d3.extent(data, d => d.date)); // Include all the dates from the data
y.domain([65000, d3.max(data, d => d.population)]); //The rangle starts from 0 and up to the max value that's in the data 

// Add x-axis
svg.append("g")
  .attr("transform", `translate(0, ${height})`) // Moves(translates) the x-axis group element to the bottom of the chart
  .style("fonr-size", "14px") // Set font size to make 14
  .call(d3.axisBottom(x)
    .tickValues(x.ticks(d3.timeMonth.every(6)))         // Format how many ticks/what interval
    .tickFormat(d3.timeFormat("%b %Y"))) // How tick labels displayed
  .call(g => g.select(".domain").remove()) // this removes th entire axis line
  .selectAll(".tick line") // Select all individual lines 
  .style("stroke-opacity", 0) // Make lines to dissapear
svg.selectAll(".tick text") // Grab the tick text to 
  .attr("fill", "#777");    // change the colour


// Add y-axis
svg.append("g")
  .style("font-size", "14px")
  .call(d3.axisLeft(y)
    .ticks((d3.max(data, d => d.population) - 65000)/ 5000) // Make the size limited to every 5000 population
    .tickFormat(d => {
      return `${(d / 1000).toFixed(0)}k`;
    })
    .tickSize(0)
    .tickPadding(10))
  .call(g => g.select(".domain").remove())
  .selectAll(".tick text")
  .style("fill", "#777") 
  .style("visibility", (d, i, nodes) => {  // Removes the bottom axis tick
    if (i === 0) {
        return "hidden"; 
    } else {
        return "visible"; 
    }
    });

// Add vertical gridlines
svg.selectAll("xGrid")
  .data(x.ticks(d3.timeMonth.every(6)))
  .join("line")
  .attr("x1", d => x(d))
  .attr("x2", d => x(d))
  .attr("y1", 0)//Set the beggining point for each line
  .attr("y2", height)//Set the end point
  .attr("stroke", "#e0e0e0") //Colour light grey
  .attr("stroke-width", .5)

// Add horisontal gridlines
svg.selectAll("yGrid")
  .data(y.ticks((d3.max(data, d => d.population) - 65000)/ 5000).slice(1))
  .join("line")
  .attr("x1", 0) //Set the beggining point for each line
  .attr("x2", width) //Set the end point
  .attr("y1", d => y(d))
  .attr("y2", d => y(d))
  .attr("stroke", "#e0e0e0") 
  .attr("stroke-width", .5)

// Create line generator that maps each data point to an x and y position based on the scales
const line = d3.line()
  .x(d => x(d.date)) // Use the x scale to position dates
  .y(d => y(d.population)); // Use the y scale to position values

// Add line path to SVG element
svg.append("path")
  .datum(data)  // Binds the data to the path
  .attr("fill", "none")  // No fill under the line
  .attr("stroke", "steelblue") // Set the line color
  .attr("stroke-width", 1) // Sets the thickness of the line
  .attr("d", line); // Use the line generator to create the path
 
});