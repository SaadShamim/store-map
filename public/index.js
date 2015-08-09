/**
 * This Module handles all front end javascript code for public/index.ejs
 * Sets up google map, fetches all store markers, handles click event
 * to markers and data retrieval
 */

//The main map object
var map

/**
 * Initialize the map
 */
function initialize() {
	//Sets the starting focus of google maps
    var mapOptions = {
      center: { lat: 43.6544382, lng: -79.3806994},
      zoom: 3
    }

    //Shows map in map-canvas div on index.ejs
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    //Grab map markers
	fetchMarkers()
}

/**
 * Grabs all markers from /stores api, displays them on the map with heat map and clustering
 */
var fetchMarkers = function() {
	jQuery.ajax({
		url : '/stores',
		dataType : 'json',
		success : function(response) {

			//used for heat map
			var heatMapData = []

			//used for marker clustering
			var markers = []

			//loop through all marker objects
			for (var i=0; i<response.length;i++) {

				//position for marker
				var position = new google.maps.LatLng(response[i].latitude, response[i].longitude)
				//add weight to heatmap for the marker
				heatMapData.push({location: position, weight: response[i].total_visitors})

				//add marker object with store id to the map
				var marker = new google.maps.Marker({
					position: position,
					map: map,
					id: response[i].storeid
				})

				markers.push(marker)

				//add click event to marker
				attachEventListener(marker)

			}

			/**
			 * set up marker cluster for better performance
			 * setup heatmap object and display on map
			 */
			var markerCluster = new MarkerClusterer(map, markers)
			var heatmap = new google.maps.visualization.HeatmapLayer({
				data: heatMapData
			})
			heatmap.setMap(map)

		}
	})
}

/**
 * Adds a click event to map maker and calls anonymous function that grabs store data when clicked
 * @param  {Object} marker the clicked marker object
 */
function attachEventListener(marker){
	google.maps.event.addListener(marker, 'click', function() {
		fetchStore(marker.id, renderDiv)
	})
}

/**
 * Grabs specific store data from /stores/id api
 * @param  {Integer} id the store id
 * @param  {Function} cb callback function that handles returned data
 */
var fetchStore = function(id, cb) {
  	jQuery.ajax({
		url : '/stores/'+id,
		dataType : 'json',
		success : function(response) {
			cb(response)
		} 
	})
} 

/**
 * Sets up store div and displays on #container div in index.ejs
 * @param  {Object} data all dynamic data to display in div
 */
function renderDiv(data){
	var element = 
		'<div class="mdl-card mdl-shadow--2dp demo-card-wide"> \
		  <div class="mdl-card__title"> \
		    <h2 class="mdl-card__title-text"> ' + data.storeid + ' </h2> \
		  </div> \
		  <ul> \
		  	<li> <i class="fa fa-globe"></i> Location: ' + data.city + ', ' + data.country + ' </li> \
		  	<li> <i class="fa fa-clock-o"></i> Start Time: ' + data.start_of_day + ' </li> \
		  	<li> <i class="fa fa-hourglass-start"></i> Campaign Duration: ' + data.campaign_duration + ' </li> \
		  	<li> <i class="fa fa-users"></i> Total Visitors: ' + data.total_visitors + ' </li> \
		  </ul> \
		</div>'

	//set the div the newly created element div
	$('#container').html(element)
}

//Initialize function once page is loaded
google.maps.event.addDomListener(window, 'load', initialize)