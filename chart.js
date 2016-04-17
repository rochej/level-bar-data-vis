$(document).ready(function(){

  var graphType = "percent"
  drawGraph(graphType);
})

var drawGraph = function(graphType){

  // set SVG size
  var w = 800
  var h = 300
  var margins = {
    top: 20,
    right: 200,
    bottom: 20,
    left: 50
  }
  var padding = 20
  var color = d3.scale.category10();

  // create SVG
  var svg = d3.select("body")
              .append("svg")
              .attr("width", w)
              .attr("height", h);

  // create axis
  if (graphType == "percent"){
    percentY(w, h, margins);
  } else {
    totalY(w, h, margins)
  }

  xScale = d3 .scale
              .linear()
              .domain([2010, 2014])
              .range([margins.left, w - margins.right]);
  xAxis = d3.svg.axis()
              .scale(xScale)
              .ticks(5)

  svg.append("g")
      .attr("transform", "translate(0, "+(h - margins.bottom)+")")
      .attr("class", "x axis")
      .call(xAxis);

  svg.append("g")
      .attr("transform", "translate("+ margins.left +", 0)")
      .attr("class", "y axis")
      .call(yAxis);

  var lineGenPercent = d3.svg.line()
                  .x(function(d){
                    return xScale(d.year);
                  })
                  .y(function(d){
                    return yScale((d.admitted / d.applied)*100)
                  })
  var lineGenTotal = d3.svg.line()
                    .x(function(d){
                      return xScale(d.year);
                    })
                    .y(function(d){
                      return yScale(d.admitted)
                    })

  dataGroup.forEach(function(d,i){
    svg.append("path")
      .attr('d', lineGenPercent(d.values))
      .transition()
      .attr('id', 'line_' + d.key)
      .attr("stroke", function(){
        return d.color = color(d.key);
      })
      .attr('class', 'crisp');
    svg.append("text")
        .attr("x", w - margins.right + padding)
        .attr("y", padding + 15 * i)
        .attr("class", "legend")
        .attr("fill", function(){
          return d.color = color(d.key);
        })
        .text(d.key);
  })

  d3.select("form")
    .on("click", function(){
      svg.select(".y.axis")
        .transition()
        .call(yAxis)
      dataGroup.forEach(function(d,i){
        svg.selectAll("path")
          .attr("d", lineGenTotal(d.values))
      })
    })
}

var percentY = function(w,h,margins){
  yScale = d3 .scale
              .linear()
              .domain([0, 100])
              .range([h - margins.top, margins.bottom]);
  yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left");

}

var totalY = function(w, h, margins){
  yScale = d3 .scale
              .linear()
              .domain([0, 50000])
              .range([h - margins.top, margins.bottom]);
  yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left");

}