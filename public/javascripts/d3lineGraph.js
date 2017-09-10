// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;
    
// Adds the svg canvas
var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// Set the ranges (output on the screen)
var x = d3.scalePoint().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Define the axes
var xAxis = d3.axisBottom().scale(x).ticks(5);
var yAxis = d3.axisLeft().scale(y).ticks(5);

// Scale the range of the data
    //x.domain(data.map(function(d) { return d.stopDate; }));
    //y.domain([0, d3.max(data, function(d) { return d.totalIn; })]);

    // Add the X Axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y-axis")    
		.call(yAxis);

function render(data){
        console.log(data);

	x.domain(data[0].map(function(d) { return d.date; }));
    var appDataMax = d3.max(data[0], function(d){ return d.totalIn; });
    var busDataMax = d3.max(data[1], function(d){ return d.totalIn; });
    y.domain([0, Math.max(appDataMax, busDataMax)]);
	
	// Define 1st line
	var valueline = d3.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.totalIn); });
	
	// Define 2nd line// define the 2nd line
	var valueline2 = d3.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.totalIn); });
	
	// Add the valueline path.
    svg.append("path").attr("class", "line").data([data[0]]).attr("d", valueline(data[0]));
	
	// Add the valueline2 path.
    svg.append("path").attr("class", "line").style("stroke", "red").data([data[1]]).attr("d", valueline2(data[1]));
	
	d3.select('.x-axis').transition().duration(2500).call(xAxis);
	d3.select('.y-axis').transition().duration(2500).call(yAxis);
}