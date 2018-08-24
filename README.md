# here-xyz-thirst-free
Thirst Free is a simple web app allowing to visualize the public water fountains in the USA and calculate routes from the user current location to the chosen fountain. It leverages [HERE XYZ](https://xyz.here.com) features.

# Background on the underlying data
Used XYZ spaces can be seen via:
```
curl -X GET "https://xyz.api.here.com/hub/spaces" -H "accept: */*" -H "Authorization: Bearer 9w5K6Ym8VwBUu0JaVQeufA"
```
Here is the response:
```
[
  {
    "id": "xtLImAHZ",
    "title": "water_fountains_usa.geojson",
    "description": "Extracted from http://overpass-turbo.eu",
    "shared": true,
    "owner": "xjmyiygJapVIgnffuM6w"
  },
  {
    "id": "ZUTOPvm6",
    "title": "Thirst Free",
    "description": "The different data created dynamically.",
    "owner": "xjmyiygJapVIgnffuM6w"
  }
]
```
