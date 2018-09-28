# here-xyz-thirst-free
Thirst Free is a simple web app allowing to visualize the public water fountains in the USA and calculate routes from the user current location to the chosen fountain. It leverages [HERE XYZ](https://xyz.here.com) features.

Check out the [live demo](https://boriguen.github.io/here-xyz-thirst-free).

# Features
1. Accept to share your location to have the app work
2. Check out the public water fountains colored in cyan
3. Select a specific water fountain that become colored in blue
4. Track your progress to the selected water fountain thanks to the calculated yellow pedestrian route
5. Be aware of how much time and distance is left to the water fountain by zooming in on the route and reading the label
6. Observe the route getting updated as you walk towards the selected water fountain

# Background on the underlying data
Used XYZ spaces can be seen via:
```
curl -X GET "https://xyz.api.here.com/hub/spaces" -H "accept: */*" -H "Authorization: Bearer AXoqaCXh6cAqoz0nDxEzUCo"
```
Here is the response:
```
[
  {
    "id": "jaz191md",
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

And for more ways to query the data, please have a look the [XYZ Swagger documentation](https://xyz.api.here.com/hub/static/swagger/).
