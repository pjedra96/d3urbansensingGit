var init_flag = false;
var valueline;
var valueline2;
// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 70, left: 50},
    width = 1300 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
    
// Adds the svg canvas
var svg = d3.select("#d3-graph")
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
    data.forEach(function(d){
        d.totalIn = +d.totalIn;
    });
    console.log(data);

	x.domain(data[0].map(function(d) { return d.date; }));
    var appDataMax = d3.max(data[0], function(d){ return d.totalIn; });
    var busDataMax = d3.max(data[1], function(d){ return d.totalIn; });
    y.domain([0, Math.max(appDataMax, busDataMax)]);
	
	// Define 1st line
	valueline = d3.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.totalIn); });
	
	// Define 2nd line// define the 2nd line
	valueline2 = d3.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.totalIn); });
	
	// Add the valueline path.
    var path = svg.append("path").attr("class", "appData").data([data[0]]).attr("d", valueline(data[0]));
	
	// Add the valueline2 path.
    var path2 = svg.append("path").attr("class", "busData").style("stroke", "red").data([data[1]]).attr("d", valueline2(data[1]));

    var totalLength = path.node().getTotalLength();
    var totalLength2 = path2.node().getTotalLength();

    path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
    .attr('stroke-dashoffset', totalLength).transition().duration(10000)
    .attr('stroke-dashoffset', 0);

    path2.attr('stroke-dasharray', totalLength2 + ' ' + totalLength2)
    .attr('stroke-dashoffset', totalLength2).transition().duration(2500)
    .attr('stroke-dashoffset', 0);
    
    d3.select('.x-axis').call(xAxis).selectAll('text')
        .attr('transform', 'rotate(-65)')
        .attr('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em');

    d3.select('.y-axis').call(yAxis);
}

function updateGraph(data){
    if(data[1].length > 0){
        x.domain(data[0].map(function(d) { return d.date; }));
        var appDataMax = d3.max(data[0], function(d){ return d.totalIn; });
        var busDataMax = d3.max(data[1], function(d){ return d.totalIn; });
        y.domain([0, Math.max(appDataMax, busDataMax)]);

        var svg = d3.select("#d3-graph").transition();
        svg.select('.appData').duration(2500).attr("d", valueline(data[0]));
        svg.select('.busData').duration(2500).attr("d", valueline2(data[1]));
        
        var line = d3.selectAll('.appData').data(data[0]);
        var line2 = d3.selectAll('.busData').data(data[1]);

        line.exit().transition().duration(2500).attr('y', height).remove();
        line2.exit().transition().duration(2500).attr('y', height).remove();
        
        d3.select('.x-axis').transition().duration(2500).call(xAxis).selectAll('text')
            .attr('transform', 'rotate(-65)')
            .attr('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em');

        d3.select('.y-axis').transition().duration(2500).call(yAxis);
    }
}