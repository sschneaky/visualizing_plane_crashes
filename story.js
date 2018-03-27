///////////
// SETUP //
///////////

const container = document.getElementById("main")
const legend    = document.getElementById("legend")
// let margin = {top: 20, right: 20, bottom: 30, left: 50}
//     , width = 1000 - margin.left - margin.right
//     , height = 700 - margin.top - margin.bottom

const width = container.clientWidth
const height = legend.clientHeight - 11


// SCALES
const SENSATIVITY = .3

// GEO
const start_rotation = [45, -25]
const projection = d3.geoOrthographic()
	.scale(width / 3)
	.rotate(start_rotation)
	.translate([width / 2, height / 2]) 

const sky_box = d3.geoOrthographic()
    .scale(projection.scale() * 1.4)
    .rotate(start_rotation)
    .translate([width / 2, height / 2])

const path = d3.geoPath()
	.projection(projection)

const crashLines = d3.line()
	.x(function(d) { return d[0] })
	.y(function(d) { return d[1] })
	.curve(d3.curveBasis)

const rotate = d3.drag()
	.subject(rotate_projection)
	.on("drag", rotate_globe)

const zoom = d3.zoom()
    .scaleExtent([.75, 10])
    .on("zoom", zoom_globe)


// LEGEND FILTERS
const pickers = {
	  'FARDescription': new Set()
	, 'Country': new Set()
	, 'EngineType': new Set() 
	, 'year': new Set()
}

const filters = [
	'FARDescription'
	,'Country'
	,'AccidentNumber'
	,'RegistrationNumber'
	,'EngineType'
	,'year'
]



//////////
// DRAW //
//////////
const body = d3.select(container)
const svg = body.append("svg")
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
}


///////////////
// FUNCTIONS //
///////////////

// DRAW FUNCTIONS
function draw_globe(globe_data){
	countries = topojson.feature(globe_data, globe_data.objects.countries).features

	svg.append("path")
		.datum({type: "Sphere"})
		.attr("class", "water")
		.attr("d", path)
		.call(rotate)


	svg.selectAll("path.country")
		.data(countries)
		.enter().append("path")
			.attr('class', "country")
			.attr('d', path)
		.call(rotate)
}

function draw_crashes(crashe_data){
	
	// draw pickers
	generate_pickers(crashe_data)

	svg.selectAll('g').data(crashe_data)
		.enter().append('path')	
			.attr("d", crash_line)
			.attr("class", hide_and_filter)
			.on('click', updateInfoBox)
		.call(rotate)

	add_filter_listeners()
}

function reDrawLines(){
    svg.selectAll("path.crash-line")
    	.attr("d", crash_line)
    	.attr("class", hide_and_filter)
}


// GEO FUNCTIONS
function rotate_projection() {
	const r = projection.rotate()
	return {x: r[0] / SENSATIVITY, y: -r[1] / SENSATIVITY}
}

function rotate_globe(){
	const r = projection.rotate()
    projection
    	.rotate([d3.event.x * SENSATIVITY, -d3.event.y * SENSATIVITY, r[2]])
    sky_box
    	.rotate([d3.event.x * SENSATIVITY, -d3.event.y * SENSATIVITY, r[2]])

    // redraw countries
    svg.selectAll("path.country")
    	.attr("d", path)

    reDrawLines()
}

function zoom_globe(){
	svg.selectAll("path")
		.attr("transform", d3.event.transform)
}



// CRASH LINE FUNCTIONS
function crash_line(data){
	// switch crash type 
	const [start, end] = get_start_and_end(data)
	const mid = d3.geoInterpolate(start, end)(.5)
	const test = crashLines([
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
		return 'crash-line hidden'
	}

	const invert = projection.invert([width/2,height/2])
    const [start, end] = get_start_and_end(data)

    const start_dis = d3.geoLength({"type": "LineString", "coordinates": [start,invert] })
    const end_dis = d3.geoLength({"type": "LineString", "coordinates": [end,invert] })

    const furthest_from_back = Math.max(start_dis,end_dis)
    return furthest_from_back < 1.57 ? 'crash-line active' : 'crash-line hidden'
}

function filtered(data){

	const reg = document.getElementById('RegistrationNumber').value
	const accident = document.getElementById('AccidentNumber').value

	if (reg && !(has(data.RegistrationNumber, reg)) || accident && !(has(data.AccidentNumber, accident))){
		return true
	}

	for (let p of Object.keys(pickers)) {
		let pic = document.getElementById(p)
		pic = pic.options[pic.selectedIndex].value
		if (pic && !(data[p] === pic)) {
			return true
		}
	}
	
	return false
}

function has(s1,s2){
	return s1 ? ~s1.toLowerCase().indexOf(s2.toLowerCase()) : true
}




// LEGEND FUNCTIONS
function generate_pickers(crashe_data){

	crashe_data.forEach(function(data){
		Object.entries(pickers).forEach(function(entry){
			let [picker, options] = entry;
			options.add(data[picker])
		})
	})

	Object.entries(pickers).forEach(function(entry){
		let [picker, options] = entry;
		let pic = document.getElementById(picker)
		options.forEach(function(o){
			if (o){
				pic.appendChild(make_option(o))
			}
		})
	})
}

function add_filter_listeners(){
	filters.forEach(function(f){
		let fil = document.getElementById(f)
		fil.addEventListener('change', reDrawLines)
	})

	const clear = document.getElementById('clear-filters')
	clear.addEventListener('click', clearFilters)
}

function clearFilters(){
	Object.keys(pickers).forEach(function(p){
		let pic = document.getElementById(p)
		pic.selectedIndex = 0
	})
	reDrawLines()
}

function make_option(c){
	const option = document.createElement('option')
	option.value = c
	option.innerText = c
	return option
}

function updateInfoBox(data){
	const info = document.getElementById('info-link')
	const a = document.createElement('a')
	a.classList.add('btn');
	a.classList.add('btn-secondary');
	a.classList.add('btn-sm');
	a.classList.add('btn-raised');
	a.href = `https://www.ntsb.gov/_layouts/ntsb.aviation/brief.aspx?ev_id=${data.EventId}`
	a.innerText = `Accident Number - ${data.AccidentNumber}`
	a.target = "_blank"

	while (info.firstChild) {
	    info.removeChild(info.firstChild);
	}

	info.appendChild(a)
}
