///////////
// SETUP //
///////////

let container = document.getElementById("main")
// let margin = {top: 20, right: 20, bottom: 30, left: 50}
//     , width = 1000 - margin.left - margin.right
//     , height = 700 - margin.top - margin.bottom

let width = container.clientWidth
let height = 600


// COLORS
const black = '#424242'
const white = '#f9f9f9'

// SCALES
const SENSATIVITY = .3

let projection = d3.geoOrthographic()
	.scale(width / 3)
	.rotate([45, 0])
	.translate([width / 2, height / 2]) 

let sky_box = d3.geoOrthographic()
    .scale(projection.scale() * 1.05)
    .rotate([45, 0])
    .translate([width / 2, height / 2])

let path = d3.geoPath()
	.projection(projection)

let crashLines = d3.line()
	.x(function(d) { return d[0] })
	.y(function(d) { return d[1] })
	.curve(d3.curveCardinal);

let rotate = d3.drag()
	.subject(rotate_projection)
	.on("drag", rotate_globe)

let zoom = d3.zoom()
    .scaleExtent([.75, 10])
    .on("zoom", zoom_globe);



//////////
// DRAW //
//////////
let body = d3.select(container)
let svg = body.append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("Stroke", "#000")
    .call(zoom)

d3.queue()
    .defer(d3.json, "data/Aviation.json")
    .defer(d3.json, "data/world-110m.json")
    .await(ready)

function ready(error, crashe_data, globe_data){
 	
 	// draw globe
 	draw_globe(globe_data)

 	// draw crashes
 	draw_crashes(crashe_data)

 	// draw tool_tip
 	// draw filters
}


function draw_globe(globe_data){
	countries = topojson.feature(globe_data, globe_data.objects.countries).features;
	svg.selectAll("path.country")
		.data(countries)
		.enter().append("path")
			.attr('class', "country")
			.attr('d', path)
			.attr('fill', black)
		.call(rotate)
}

function draw_crashes(crashe_data){
	svg.selectAll('g').data(crashe_data)
		.enter().append('path')
			.attr('class', 'crash-line')	
			.attr('d', crash_line)
			.style("opacity", hide_and_filter)
}

function rotate_projection() {
	let r = projection.rotate()
	return {x: r[0] / SENSATIVITY, y: -r[1] / SENSATIVITY}
}

function rotate_globe(){
	let r = projection.rotate();
    projection
    	.rotate([d3.event.x * SENSATIVITY, -d3.event.y * SENSATIVITY, r[2]]);
    sky_box
    	.rotate([d3.event.x * SENSATIVITY, -d3.event.y * SENSATIVITY, r[2]]);

    // redraw countries
    svg.selectAll("path.country")
    	.attr("d", path);

    // redraw crash lines
    svg.selectAll("path.crash-line")
    	.attr("d", crash_line)
    	.style("opacity", hide_and_filter)
}

function zoom_globe(){
	svg.selectAll("path")
		.attr("transform", d3.event.transform)
}

function crash_line(data){
	// switch crash type 
	let [start, end] = get_start_and_end(data)
	let mid = d3.geoInterpolate(start, end)(.5)
	let test = crashLines([
		  projection(start)
		, sky_box(mid)
		, projection(end)
	])
	return test

}

function get_start_and_end(data){
	return [
		  [+data.airport_long, +data.airport_lat]
		, [+data.Longitude, +data.Latitude]
	]
}

function hide_and_filter(data){
	// if filtered
	// return 0
	if (filtered(data)){
		return 0;
	}

	let invert = projection.invert([width/2,height/2])
    let [start, end] = get_start_and_end(data)

    let start_dis = d3.geoLength({"type": "LineString", "coordinates": [start,invert] })
    let end_dis = d3.geoLength({"type": "LineString", "coordinates": [end,invert] })

    let furthest_from_back = Math.max(start_dis,end_dis)
    return furthest_from_back < 1.57 ? 1: 0;

}

function filtered(data){
	console.log(data)
	return false
}

