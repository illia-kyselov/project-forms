function parsePolygon(geom) {
    const polygonString = geom.replace(/^POLYGON\s*\(/i, "").replace(/\)$/, "");
    const coordinates = polygonString.split(",").map((pair) => {
      const [lng, lat] = pair.trim().split(" ");
      return [parseFloat(lat), parseFloat(lng)];
    });
    return {
      type: "Polygon",
      coordinates: [coordinates],
    };
  }
  
  function swapCoordinates(geoJSON) {
    if (geoJSON && geoJSON.coordinates) {
      const swappedCoordinates = geoJSON.coordinates.map((coordinates) => {
        return [coordinates[1], coordinates[0]];
      });
      geoJSON.coordinates = swappedCoordinates;
    }
    return geoJSON;
  }

module.exports = {
    parsePolygon,
    swapCoordinates
}