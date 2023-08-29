const express = require("express");
const { Client } = require("pg");
const cors = require("cors");

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

//takes

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

app.get("/doc_plg/filteredPolygons/:lat/:lng", (req, res) => {
  const lat = req.params.lat;
  const lng = req.params.lng;

  const query = `
    SELECT objectid, num_disl, pro_name, ST_AsText(geom) AS geom
    FROM exploitation.doc_plg
    WHERE ST_Contains(geom, ST_GeomFromText('POINT(${lng} ${lat})', 4326));
  `;

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

app.get("/dict_dz_form", (req, res) => {
  const query =
    "SELECT id, num_pdr_new, form_dz FROM exploitation.dict_dz_form";
  client.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query", err);
      res.status(500).send("Error executing query");
    } else {
      const data = result.rows.map((row) => ({
        id: row.id,
        num_pdr_new: row.num_pdr_new,
        form_dz: row.form_dz,
      }));
      res.json(data);
    }
  });
});

app.get("/dz", (req, res) => {
  const query =
    "SELECT id, ST_AsGeoJSON(geom) AS geom, id_znk, topocode, num_sing, num_pdr FROM exploitation.dz";
  client.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query", err);
      res.status(500).send("Error executing query");
    } else {
      const data = result.rows.map((row) => ({
        id: row.id,
        geom: swapCoordinates(JSON.parse(row.geom)),
        id_znk: row.id_znk,
        num_pdr: row.num_pdr,
        topocode: row.topocode,
        num_sing: row.num_sing,
      }));
      res.json(data);
    }
  });
});

app.get("/elements", (req, res) => {
  const query =
    "SELECT id_elmts, expl_dz_id, name_elmns, cnt_elmnt FROM exploitation.elements";
  client.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query", err);
      res.status(500).send("Error executing query");
    } else {
      const data = result.rows.map((row) => ({
        id_elmts: row.id_elmts,
        expl_dz_id: row.expl_dz_id,
        name_elmns: row.name_elmns,
        cnt_elmnt: row.cnt_elmnt,
      }));
      res.json(data);
    }
  });
});

app.get("/elements/:expl_dz_id", (req, res) => {
  const expl_dz_id = req.params.expl_dz_id;
  const query = `
    SELECT id_elmts, expl_dz_id, name_elmns, cnt_elmnt
    FROM exploitation.elements
    WHERE expl_dz_id = $1
  `;

  const values = [expl_dz_id];

  client.query(query, values, (err, result) => {
    if (err) {
      console.error("Error executing query", err);
      res.status(500).send("Error executing query");
    } else {
      const data = result.rows.map((row) => ({
        id_elmts: row.id_elmts,
        expl_dz_id: row.expl_dz_id,
        name_elmns: row.name_elmns,
        cnt_elmnt: row.cnt_elmnt,
      }));
      res.json(data);
    }
  });
});

app.get("/dz_forms", (req, res) => {
  const query =
    "SELECT id, num_pdr_new, form_dz FROM exploitation.dict_dz_form";
  client.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query", err);
      res.status(500).send("Error executing query");
    } else {
      const data = result.rows.map((row) => ({
        id: row.id,
        num_pdr_new: row.num_pdr_new,
        form_dz: row.form_dz,
      }));
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

function swapCoordinates(geoJSON) {
  if (geoJSON && geoJSON.coordinates) {
    const swappedCoordinates = geoJSON.coordinates.map((coordinates) => {
      return [coordinates[1], coordinates[0]];
    });
    geoJSON.coordinates = swappedCoordinates;
  }
  return geoJSON;
}

//push
app.post("/odr_proekty_plg", (req, res) => {
  const formData = req.body;

  const query = `
    INSERT INTO exploitation.odr_proekty_plg (id_plg, id_odr_pr_list, doc_fold)
    VALUES ($1, $2, $3)
  `;

  const values = [formData.id_plg, formData.id_odr_pr_list, formData.doc_fold];

  client.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting data into database", err);
      res.status(500).send("Error inserting data into database");
    } else {
      res.json({ message: "Data successfully inserted into database" });
    }
  });
});

app.post("/work_table", (req, res) => {
  const formData = req.body;

  const query = `
    INSERT INTO exploitation.work_table (type_work, is_doc, id_doc, address, date_work, pers_work, uuid)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;

  const values = [
    formData.type_work,
    formData.is_doc,
    formData.id_doc,
    formData.address,
    formData.date_work,
    formData.pers_work,
    formData.uuid,
  ];

  client.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting data into database", err);
      res.status(500).send("Error inserting data into database");
    } else {
      res.json({ message: "Data successfully inserted into database" });
    }
  });
});

app.post("/expl_dz", (req, res) => {
  const formData = req.body;

  const query = `
    INSERT INTO exploitation.expl_dz (is_dz, id_expl_dz, num_dz, dz_form, id_disl_dz, uuid)
    VALUES ($1, $2, $3, $4, $5, $6)
  `;

  const values = [
    formData.is_dz,
    formData.id_expl_dz,
    formData.num_dz,
    formData.dz_form,
    formData.id_disl_dz,
    formData.uuid,
  ];

  client.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting data into database", err);
      res.status(500).send("Error inserting data into database");
    } else {
      res.json({ message: "Data successfully inserted into database" });
    }
  });
});

app.post("/elements", (req, res) => {
  const formData = req.body;

  const query = `
    INSERT INTO exploitation.elements (id_elmts, expl_dz_id, name_elmns, cnt_elmnt, uuid, uid)
    VALUES ($1, $2, $3, $4, $5, $6)
  `;

  const values = [
    formData.fid,
    formData.tableId,
    formData.element,
    formData.quantity,
    formData.uuid,
    formData.dztab_uuid,
  ];

  client.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting data into database", err);
      res.status(500).send("Error inserting data into database");
    } else {
      res.json({ message: "Data successfully inserted into database" });
    }
  });
});
