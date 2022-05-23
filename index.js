// DATA PLOTTING AND VISUALISATION

// Needed Variables
const height = 720;
const width = 1080;
const margin = {top:40, right:80, bottom:60, left:50};

// Create Necessary HTML Elements

  // Add svg element
d3.select('body')                                                               // Data visualisation will happen on svg element
  .append('svg')                                                                // Add svg element
  .classed('DataVisualisation', true)                                           // Give class
  .attr('height', height)                                                       // Assign height to svg element
  .attr('width', width)                                                         // Assign width to svg element
  ;

var svg = d3.select('svg')                                                      // Shortcut to select svg element

// Visualise Data
function render(data){                                                          // Function that will start visualizing the data

//Function to format Integers
var formatInteger = function(integer){                                          // Function to improve readibility of integers
  if(integer == 0){                                                             // If Integer  is 0 return 0M
    return "0M"
  } else if (integer >= 10000000 && integer< 100000000) {                       // Elseif integer between 10.000.000 and 100.000.00. return format 10m,20m,30m, ....
    var population = integer;
    var format = d3.format(".2s")
    return format(integer)
  } else if (integer >= 100000000 && integer <1000000000) {                      // elseif >100.000.000 < 1.000.000.000 return format 100m, 120m,150m, ....
    var population = integer;
    var format = d3.format(".3s")
    return format(integer)
  } else{
    var population = integer;
    var format = d3.format(".2s")
    return format(integer)
  }
}

  // Scales
  var yScale = d3.scaleLinear()                                                 // Function create linear scale
    .domain([0, d3.max(data, (item) => item["2030"])])                          // Data domain, 0 to highest population size in data
    .range([height - margin.bottom, margin.top])                                // The bounds of data domain
    .nice()                                                                     // Rounding the domain
    ;

  var xScale = d3.scaleBand()                                                   // Scale band to visualize Locations on x Axis, the band will ensure the x tick is in middle of the bar
    .domain(d3.map(data, (item) => item.Location))                              // Data domain consisting of every country name
    .range([margin.left, width - margin.right])                                 // Bounds of data domain
    .padding(0.2)                                                               // Spacing between bands
    ;

  // Axis
  var yAxis = d3.axisLeft()                                                     // Function create axis
    .scale(yScale)                                                              // Axis based on yScale
    .tickFormat((d) => formatInteger(d).replace("G", "B"))
  svg
    .append('g')                                                                // Add group element to place axis in
    .classed('axis y', true)                                                    // Give classes
    .call(yAxis)                                                                // Call yAxis function
    .attr('transform', 'translate(' + margin.left + ',' + 0 + ')' )             // Set axis on right coordinates
    ;

  var xAxis = d3.axisBottom()                                                   // function create axis
    .scale(xScale)                                                              // Axis based on xScale
    ;

  svg
    .append('g')                                                                // Add group element to place axis in
    .classed('axis x', true)                                                    // Give classes
    .call(xAxis)                                                                // Call yAxis function
    .attr('transform', 'translate('+ 0 + ',' + (height -margin.bottom) + ')')   // Set axis on right coordinates
    ;

  //bars
  svg
    .append('g')                                                                // Add group element to place bars in
    .classed('bars', true)                                                      // Give classes
    .selectAll('rect')                                                          // Select all rect elements to draw bars with
    .data(data)                                                                 // Bind data
    .join('rect')                                                               // Append rect for every row in data
    .classed('bar',true)                                                        // Give class to every rect
    .attr('x', (d) => xScale(d.Location))                                       // Set x coordinate for every rect
    .attr('y', (d) => yScale(0))                                                // Set y coordinate for every rect
    .attr('width', xScale.bandwidth())                                          // Set width for every rect
    .attr('height', (d) => (height - margin.bottom) - yScale(0))                // Set height for every rect
    .attr('fill', 'black')                                                      // Add fill to bars
    ;

  svg
    .append('g')                                                                // Add group for labels
    .classed('labels', true)                                                    // Give classes
    .selectAll('text')                                                          // Select all text elements
    .data(data)                                                                 // Bind data
    .join('text')                                                               // Create text element for every row of data
    .classed('label',true)                                                      // Give text element class
    .attr('x', (d) => xScale(d.Location))                                       // Set x coordinate to year
    .attr('y', (d) => yScale(0) - 5)                                            // Set y coordinate to 0 for transition
    .attr('dx', "1em")                                                       // Set dx attribute to center label on bar
    .text((d) => formatInteger(d["2030"]).replace("G", "B"))                    // Set text
    ;

// TRANSITIONS

  // Bar Transition
  d3.selectAll('rect')                                                          // Select all rect for transition
    .transition()                                                               // Initiate transition
    .duration(1000)                                                             // Duration of the transition 1 second
    .attr('y', (d) => yScale(d["2030"]))                                        // Rect y coordinate at the end of  the transition
    .attr('height', (d) => (height - margin.bottom) - yScale(d["2030"]))        // Rect height at the end of the transition
    .delay(function(d,i){return(i*100)})                                        // Delay for every bar so to start little after each other
    ;

  // Label Transition
  d3.selectAll('.label')                                                        // Select all rect for transition
    .transition()                                                               // Initiate transition
    .duration(1000)                                                             // Duration of the transition 1 second
    .attr('y', (d) => yScale(d["2030"]) -5)                                     // text y coordinate - 5 at the end of  the transition
    .delay(function(d,i){return(i*100)})                                        // Delay for every text so to start little after each other
    ;
}


// DATA LOADING
d3.csv('PopulationSizeTop102030.csv').then((data) => {

// DATA CLEANING & PREPARATION

  // Missing Data
    // No missing data

  // Duplicate Data
    // No duplicate data


  // Transforming Data
    // Ensure correct data types
  data.forEach((item, i) => {                                                   // For each object in array
    item["2030"] = +item["2030"] * 1000;                                        // Transform value from key["2030"] from string to integer
    item["Country Code"] = +item["Country Code"]                                // Transform value from key["Country Code"] from string to integer
  });

// Function to start Plotting and Visualisation
  render(data)
})
