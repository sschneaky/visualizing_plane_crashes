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

let body = d3.select(container)

const SENSATIVITY = .3

let projection = d3.geoOrthographic()
	.scale(width / 3)
	.rotate([0, 0])
	.translate([width / 2, height / 2])
	.clipAngle(90)

let path = d3.geoPath()
	.projection(projection)

let rotate = d3.drag()
	.subject(rotate_projection)
	.on("drag", rotate_globe)

let zoom = d3.zoom()
    .scaleExtent([.75, 10])
    .on("zoom", zoom_globe);



//////////
// DRAW //
//////////
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
	console.log(globe_data)
 	
 	// draw globe
 	draw_globe(globe_data)

 	// draw crashes
 	// draw_crashes(crashe_data)

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

// function draw_crashes(crashe_data){

// }

function rotate_projection() {
	let r = projection.rotate()
	return {x: r[0] / SENSATIVITY, y: -r[1] / SENSATIVITY}
}

function rotate_globe(){
	let r = projection.rotate();
    projection
    	.rotate([d3.event.x * SENSATIVITY, -d3.event.y * SENSATIVITY, r[2]]);
    svg.selectAll("path.country")
    	.attr("d", path);
}

function zoom_globe(){
	svg.selectAll("path")
		.attr("transform", d3.event.transform)
}

