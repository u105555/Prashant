//******************************************************************Main Application************************************************************************************************
//*******************************************************************************************************************************************************************

//**********************************************************************Part A*************************************************************************************
//************************************************************Map Layers and Markers**************************************************************************
// L.map instantiates the webmap.
var map = L.map('map', {
	center: [ 27.6794, 85.3208], // Center and zoom define how the map is displayed when called.
	zoom: 14,

});

var stopsMark = L.geoJSON(stops, {
	pointToLayer: function (feature, latlng){ //pointToLayer returns a layer and enables us to change the display properties of GeoJSON points
		var smallIcon = new L.Icon({  // Creating an icon for the bus stops
			iconSize: [35, 35], //size of the icon
			iconAnchor: [15, 27], //point of the icon which will correspond to marker's location
			popupAnchor: [1, -24], //point from which the popup should open relative to the iconAnchor
			iconUrl: "css/Images/icon.png" //Relative location of the icon
		});
		return L.marker(latlng, {icon: smallIcon});
		},
// For every feature in the feature collection i.e. bus stops this function creates a popup that displays their attributes
		onEachFeature: function (feature, layer){
			layer.bindPopup(" <b>Name: </b>" + feature.properties.Name + '</br>' +
				"<b>Bus Stop: </b>" + feature.properties.Bus_stop + '</br>' +
				"<b>Address: </b>" + feature.properties.Address + '</br>' +
				"<b>Street number/name: </b>" + feature.properties.Street_No + '</br>' +
				"<b>Zip Code: </b>" + feature.properties.Zip_Code + '</br>' +
				"<b>Bus_route: </b>" + feature.properties.Bus_route + '</br>');
				layer.on({
					click: function m (e){     //This function zooms to the clicked marker
						map.setView(e.latlng, 16)
					}
				});
								}


}).addTo(map);
//Below 3 lines create buffers which we will take as service area of each stop
var stpt = L.geoJSON(stops); //1. Created a GeoJSON layer
var buffered = turf.buffer(stpt.toGeoJSON(), 0.2, {units: 'kilometers'}); //2. buffer method from Truf JavaScript library is used to create a 200m buffer around each stop
var buf = new L.geoJSON(buffered); //3.Finally GeoJSON layer for the buffer is created

// Basemaps are instantiated with L.tileLayer. Attributation is important to show where the basemap comes from.
// Minzoom and maxzoom are useful to set the minimum and maximum zoom level for the user.

// Adding Open Street map
var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
var osm = new L.tileLayer(osmUrl, {
	minZoom: 12,
	maxZoom: 30,
	attribution: osmAttrib
}).addTo(map);

// Preaparing to add ArcGIS World imagery base map to our map
var aerialUrl='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
var aerialAttrib='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
var aerial = L.tileLayer(aerialUrl, {
	minZoom: 12,
	maxZoom: 30,
	attribution: aerialAttrib
});
// Preparing to add Stamen Tone Hybrid layer (consists of labels, streets etc) to our map
var Stamen_TonerHybrid = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-hybrid/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 12,
	maxZoom: 30,
	ext: 'png'
});

// Making a list of base maps i.e. OSM and ArcGIS world imagery which will be added to a layer control
var baseMaps = {
    "OSM": osm,
    "ESRI World Imagery": aerial
};
// Making a list of data layers maps i.e. bus stops, Stamen toner hybrid and buffers which will be added to a layer control
var overlayMaps = {
    "Stops": stopsMark,
	"Roads and Labels": Stamen_TonerHybrid,
	"Service Area": buf
};

//Adding the data layers and the base maps to a layer control
var mapsCon = L.control.layers(baseMaps, overlayMaps).addTo(map);

//**********************************************************************Part B*************************************************************************************
//*******************Map Buttons, Tools and Elements (JS libraries used except the leaflet are given in the References )**************************************************************************

//Adding a simple scale to the map as layer control
var scale =L.control.scale({position: "bottomright"}).addTo(map);

//Adding a north arrow to the map as layer control
var north =L.control({position: "bottomleft"});
north.onAdd = function(map){
	var div = L.DomUtil.create("div", "mapElements")
	div.innerHTML = '<img src="css/Images/n.png" width="30" height="50">';
	return div;
}
north.addTo(map);

//This control will be used to display the Goto Lalitput button
var lalitpur =L.control({position: "topleft"});

//function to create the Goto lalitpur button
lalitpur.onAdd = function(map){
	var laldiv = L.DomUtil.create("div", "mapElements") //Creates a HTML <div> element and appends it to "mapElements" container
	laldiv.innerHTML = '<button type="button" onclick="lal()">Goto Lalitpur</button>'; //Creates a button inside the <div> which when clicked calls the lal() function i.e. the function that zooms in to the bus stops in lalitpur
	return laldiv;
}
lalitpur.addTo(map);
// Function that zooms in to the bus stops in lalitpur metropolitan
function lal(){
	map.setView([27.6718, 85.3107], 14);
};


//This control will be used to display the Goto Kathmandu button
var ktm =L.control({position: "topleft"});

//function to create the Goto Kathmandu button
ktm.onAdd = function(map){
	var ktmdiv = L.DomUtil.create("div", "mapElements")
	ktmdiv.innerHTML = '<button type="button" onclick="goktm()">Goto Kathmandu</button>';
	return ktmdiv;
}
ktm.addTo(map);

// Function that zooms in to the bus stops in Kathmandu metropolitan
function goktm(){
	map.setView([27.6964, 85.3338], 14);
};

//This control will be used to display the information about the measure tool i.e. tool that measure distances
var measure =L.control({position: "topleft"});

//Function to add measure tool information on the map
measure.onAdd = function(map){
	var measurediv = L.DomUtil.create("div", "mapElements")
	measurediv.innerHTML = '<b style="background-color:white;">Use the tool below to measure distances</b>';
	return measurediv;
}
measure.addTo(map);

//This variable creates and adds the measure tool as a layer control on the top left of the map
//Measure tool uses a custom library leaflet.measure.js in the js folder
 var measureTool = L.control.measure({
        position: 'topleft', //  control position
        keyboard: true, //  weather to use keyboard control for this plugin
        activeKeyCode: 'M'.charCodeAt(0),  //  shortcut to activate measure
        lineColor: 'red',  //  line color
        lineWeight: 2, //  line weight
        lineDashArray: '6, 6', //  line dash
        lineOpacity: 1, //  line opacity
      }).addTo(map);

//This variable creates and adds a box showing geographical coordinates of the cursor on the map
var coordinates = L.control.mousePosition({
	position: "bottomright",  //Control position
	separator: ",", //Separator string that separates latitude and longitude
	numDigits: 5, //Digits after decimal to be displayed
	prefix: "Coordinates: " //prefix added at the front of the coordinates
}).addTo(map);
//******************************************************************************************************************************************************************
//**********************************************************************END********************************************************************************************




