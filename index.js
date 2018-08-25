var YOUR_ACCESS_TOKEN = '9w5K6Ym8VwBUu0JaVQeufA';
var APP_ID = 'xjmyiygJapVIgnffuM6w';
var APP_CODE = 'ZlMdV3eLHiRll-8HO3MayA';
var SELECTED_POINT_STYLE = [{
            zIndex: 3,
            type: "Circle",
            radius: 9,
            fill: "blue"
          }, {
            zIndex: 4,
            type: "Image",
            src: "img/drop.png",
            width: 24,
            height: 24
          }];

kickoff();

/**
 * Bootstraps all the code to be executed.
 */
function kickoff() {
  /*
   * INITIALIZE VARIABLES.
   */

  var currentPositionFeature = null;
  var currentFountainFeature = null;
  var currentRouteFeature = null;
  var display = null;
  var waterFountainsLayer = null;
  var thirstFreeLayer = null;
  var infoTag = document.querySelector("#info");

  /*
   * INSTANTIATE PLATFORM STUFF.
   */

  var secure = (location.protocol === 'https:') ? true : false;
  var platform = new H.service.Platform({
    app_code: APP_CODE,
    app_id: APP_ID,
    useCIT: true,
    useHTTPS: secure
  });
  var router = platform.getRoutingService();

  /*
   * INSTANTIATE XYZ STUFF.
   */

  var layers = [
    new here.xyz.maps.layers.TileLayer({
      name: 'Image Layer',
      min: 1,
      max: 20,
      provider: new here.xyz.maps.providers.ImageProvider({
        name: 'Live Map',
        url: 'https://{SUBDOMAIN_INT_1_4}.mapcreator.tilehub.api.here.com/tilehub/wv_livemap_bc/png/terrain/512/{QUADKEY}?access_token=' + YOUR_ACCESS_TOKEN
      })
    })
  ];

  /*
   * DEFINE LOGIC.
   */

  trackPosition();

  /*
   * CREATE FUNCTIONS.
   */

  function trackPosition() {
    if (navigator.geolocation) {
      var options = {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 0
      };
      navigator.geolocation.watchPosition(onWatchPositionSuccess, onWatchPositionError, options);
    } else {
      infoTag.innerText = "Geolocation is not supported by this browser. Please use another one.";
    }
  }

  function onWatchPositionSuccess(position) {
    console.log('Position got updated: ' + [position.coords.longitude, position.coords.latitude].join(', '));
    if (!display) {
      intialize(position.coords.longitude, position.coords.latitude);
    }
    updateCurrentPositionFeature(position);
    if (currentFountainFeature) {
      updateRoute();
    }
  }

  function updateCurrentPositionFeature(position) {
    if (currentPositionFeature) {
      thirstFreeLayer.removeFeature(currentPositionFeature);
    }
    currentPositionFeature = {
      geometry: {
        coordinates: [position.coords.longitude, position.coords.latitude, 0],
        type: "Point"
      },
      type: "Feature"
    }
    thirstFreeLayer.addFeature(currentPositionFeature);
  }

  function onWatchPositionError(error) {
    infoTag.innerText = "Please share your location or resolve the problem as we can't move forward currently: " + error;
  }

  function intialize(longitude, latitude) {
    display = getDisplay(longitude, latitude);
    waterFountainsLayer = getWaterFountainsLayer();
    display.addLayer(waterFountainsLayer);
    thirstFreeLayer = getThirstFreeLayer();
    display.addLayer(thirstFreeLayer);
    display.addEventListener('pointerup', onFeatureClick);
  }

  function getDisplay(longitude, latitude) {
    var display = new here.xyz.maps.Map(document.getElementById("map"), {
      zoomLevel: 15,
      center: {
        longitude: longitude,
        latitude: latitude
      },
      layers: layers
    });

    window.addEventListener('resize', function() {
      display.resize();
    });

    return display;
  }

  function getWaterFountainsLayer() {
    return new here.xyz.maps.layers.TileLayer({
      name: 'WaterFountains',
      min: 8,
      max: 20,
      provider: new here.xyz.maps.providers.SpaceProvider({
        name: 'WaterFountainsProvider',
        level: 6,
        space: 'xtLImAHZ',
        credentials: {
          access_token: YOUR_ACCESS_TOKEN
        }
      }),
      style: {
        styleGroups: {
          pointStyle: [{
            zIndex: 3,
            type: "Circle",
            radius: 7,
            fill: "cyan"
          },{
            zIndex: 4,
            type: "Image",
            src: "img/drop.png",
            width: 16,
            height: 16
          }]
        },
        assign: function(feature, zoomlevel) {
          return "pointStyle";
        }
      }
    })
  }

  function getThirstFreeLayer() {
    return new here.xyz.maps.layers.TileLayer({
      name: 'ThirstFree',
      min: 8,
      max: 20,
      provider: new here.xyz.maps.providers.SpaceProvider({
        name: 'ThirstFreeProvider',
        level: 6,
        space: 'ZUTOPvm6',
        credentials: {
          access_token: YOUR_ACCESS_TOKEN
        }
      }),
      style: {
        styleGroups: {
          linkStyle: [{
              zIndex: 0,
              type: "Line",
              stroke: "#E5B50B",
              strokeWidth: 11,
              "strokeLinecap": "butt"
            },
            {
              zIndex: 1,
              type: "Line",
              stroke: "#1F1A00",
              strokeWidth: 11,
              "strokeLinecap": "butt",
              'strokeDasharray': [6, 6]
            },
            {
              zIndex: 2,
              type: "Line",
              stroke: "#F7FABF",
              strokeWidth: 7
            },
            {
              zIndex: 3,
              type: "Text",
              textRef: "properties.summary",
              fill: "#3D272B"
            }
          ],
          pointStyle: [{
            zIndex: 4,
            type: "Image",
            src: "img/here-logo.png",
            width: 32,
            height: 32
          }]
        },
        assign: function(feature, zoomlevel) {
          return feature.geometry.type == 'Point' ? 'pointStyle' : 'linkStyle';
        }
      }
    });
  }

  function onFeatureClick(event) {
    if (currentFountainFeature) {
      waterFountainsLayer.setStyleGroup(currentFountainFeature);
      currentFountainFeature = null;
    }

    if (event.target) {
      currentFountainFeature = event.target;
      waterFountainsLayer.setStyleGroup(currentFountainFeature, SELECTED_POINT_STYLE);
      console.log('This feature got clicked on: ' + JSON.stringify(currentFountainFeature.properties, undefined, 2));
      infoTag.innerText = "Water fountain located at: " + JSON.stringify(currentFountainFeature.geometry);
      updateRoute();
    } else {
      if (currentRouteFeature) {
        thirstFreeLayer.removeFeature(currentRouteFeature);
        currentRouteFeature = null;
      }
      infoTag.innerText = "No water fountain selected.";
    }
  }

  function updateRoute() {
    if (currentPositionFeature && currentFountainFeature) {
      var start = currentPositionFeature.geometry.coordinates[1] + ',' + currentPositionFeature.geometry.coordinates[0];
      var destination = currentFountainFeature.geometry.coordinates[1] + ',' + currentFountainFeature.geometry.coordinates[0];
      var routeRequestParams = {
        mode: 'shortest;pedestrian',
        representation: 'display',
        waypoint0: start,
        waypoint1: destination,
        routeattributes: 'waypoints,summary,shape,legs',
        maneuverattributes: 'direction,action'
      };

      router.calculateRoute(
        routeRequestParams,
        onRouteCalculationSuccess,
        onRouteCalculationError
      );
    }
  }

  function onRouteCalculationSuccess(result) {
    console.log('onRouteCalculationSuccess: ' + JSON.stringify(result));
    if (currentRouteFeature) {
      thirstFreeLayer.removeFeature(currentRouteFeature);
      currentRouteFeature = null;
    }

    if (result && result.response) {
      var route = result.response.route[0];
      currentRouteFeature = extractFeature(route);
      if (currentRouteFeature) {
        thirstFreeLayer.addFeature(currentRouteFeature);
      }
    }
  }

  function extractFeature(route) {
    var feature = null;
    if (route) {
      feature = {
        type: "Feature",
        geometry: {
          coordinates: [],
          type: "LineString"
        },
        properties: {
          summary: (route.summary.travelTime / 60).toFixed(0) + ' minutes, ' + (route.summary.distance / 1000.0).toFixed(2) + ' km'
        }
      };

      route.shape.forEach(function(coordinatesPair) {
        var split = coordinatesPair.split(',');
        var longitude = parseFloat(split[1]);
        var latitude = parseFloat(split[0]);
        feature.geometry.coordinates.push([longitude, latitude, 0]);
      });
    }
    return feature;
  }

  function onRouteCalculationError(error) {
    alert('Ooops! Something went wrong with the route calculation: ' + error);
  }
}
