const express = require("express");
const { Client } = require("pg");
const cors = require("cors");
const pgp = require("pg-promise")();

const app = express();
const port = 3001;

app.use(cors());

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "mydatabase",
  password: "6006059a",
  port: 5432,
});

client.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/doc_plg", (req, res) => {
  const query =
    "SELECT objectid, num_disl, pro_name, ST_AsText(geom) AS geom FROM exploitation.doc_plg";
  client.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query", err);
      res.status(500).send("Error executing query");
    } else {
      const data = result.rows.map((row) => ({
        objectid: row.objectid,
        num_disl: row.num_disl,
        pro_name: row.pro_name,
        geom: parsePolygon(row.geom),
      }));
      res.json(data);
    }
  });
});

app.get("/doc_plg/:objectid", (req, res) => {
  const objectid = req.params.objectid;
  const query = `SELECT objectid, num_disl, pro_name FROM exploitation.doc_plg WHERE objectid = '${objectid}'`;
  client.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query", err);
      res.status(500).send("Error executing query");
    } else {
      const data = result.rows;
      res.json(data);
    }
  });
});

app.get("/dict_work", (req, res) => {
  const query = "SELECT name_wrk FROM exploitation.dict_work";
  client.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query", err);
      res.status(500).send("Error executing query");
    } else {
      const data = result.rows.map((row) => row.name_wrk);
      res.json(data);
    }
  });
});

app.get("/dict_geform", (req, res) => {
  const query = "SELECT id_gform FROM exploitation.dict_geform";
  client.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query", err);
      res.status(500).send("Error executing query");
    } else {
      const data = result.rows.map((row) => row.id_gform);
      res.json(data);
    }
  });
});

app.get("/dict_elmnts", (req, res) => {
  const query = "SELECT name_elm FROM exploitation.dict_elmnts";
  client.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query", err);
      res.status(500).send("Error executing query");
    } else {
      const data = result.rows.map((row) => row.name_elm);
      res.json(data);
    }
  });
});

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

app.get("/dz", (req, res) => {
  const query =
    "SELECT id, ST_AsGeoJSON(geom) AS geom, id_znk, topocode FROM exploitation.dz";
  client.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query", err);
      res.status(500).send("Error executing query");
    } else {
      const data = result.rows.map((row) => ({
        id: row.id,
        geom: swapCoordinates(JSON.parse(row.geom)),
        id_znk: row.id_znk,
      }));
      res.json(data);
    }
  });
});

function swapCoordinates(geoJSON) {
  if (geoJSON && geoJSON.coordinates) {
    const swappedCoordinates = geoJSON.coordinates.map((coordinates) => {
      return [coordinates[1], coordinates[0]];
    });
    geoJSON.coordinates = swappedCoordinates;
  }
  return geoJSON;
}
