const express = require("express");
const { Client } = require("pg");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const authMiddleware = require('./auth/middleware');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(authMiddleware);

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "mydatabase",
  password: "6006059a",
  port: 5432,
});

client.connect();

app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//get

// app.get("/doc_plg", (req, res) => {
//   const { minLat, minLng, maxLat, maxLng } = req.query;

//   const query = {
//     text: `
//       SELECT objectid, num_disl, pro_name, ST_AsText(geom) AS geom
//       FROM exploitation.doc_plg
//       WHERE ST_Intersects(
//         geom,
//         ST_MakeEnvelope($1, $2, $3, $4, 4326)
//       )
//     `,
//     values: [minLng, minLat, maxLng, maxLat],
//   };

//   client.query(query, (err, result) => {
//     if (err) {
//       console.error("Error executing query", err);
//       res.status(500).send("Error executing query");
//     } else {
//       const data = result.rows.map((row) => ({
//         objectid: row.objectid,
//         num_disl: row.num_disl,
//         pro_name: row.pro_name,
//         geom: parsePolygon(row.geom),
//       }));
//       res.json(data);
//     }
//   });
// });

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
  const limit = 4000;
  const { minLat, minLng, maxLat, maxLng } = req.query;

  const query = {
    text: `
      SELECT id, ST_AsGeoJSON(geom) AS geom, num_pdr, ang_map
      FROM exploitation.dz
      WHERE ST_Within(geom, ST_MakeEnvelope($1, $2, $3, $4, 4326))
      LIMIT $5
    `,
    values: [minLng, minLat, maxLng, maxLat, limit],
  };

  client.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query", err);
      res.status(500).send("Error executing query");
    } else {
      const data = result.rows.map((row) => ({
        id: row.id,
        geom: swapCoordinates(JSON.parse(row.geom)),
        num_pdr: row.num_pdr,
        ang_map: row.ang_map,
      }));
      res.json(data);
    }
  });
});

app.get("/dz/filteredPoints/:lat/:lng", (req, res) => {
  const lat = req.params.lat;
  const lng = req.params.lng;

  const query = `
    SELECT id, ST_AsGeoJSON(geom) AS geom, num_pdr, ang_map
    FROM exploitation.dz
    WHERE ST_DWithin(geom, ST_GeomFromText('POINT(${lng} ${lat})', 4326), 0.001);
  `;

  client.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query", err);
      res.status(500).send("Error executing query");
    } else {
      const data = result.rows.map((row) => ({
        id: row.id,
        geom: swapCoordinates(row.geom),
        num_pdr: row.num_pdr,
        ang_map: row.ang_map,
      }));
      res.json(data);
    }
  });
});

app.get("/work_table", (req, res) => {
  const query =
    "SELECT id_wrk_tbl, type_work, is_doc, id_doc, address, date_work, pers_work, uuid FROM exploitation.work_table";
  client.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query", err);
      res.status(500).send("Error executing query");
    } else {
      const data = result.rows.map((row) => ({
        id_wrk_tbl: row.id_wrk_tbl,
        type_work: row.type_work,
        is_doc: row.is_doc,
        id_doc: row.id_doc,
        address: row.address,
        date_work: row.date_work,
        pers_work: row.pers_work,
        uuid: row.uuid,
      }));
      res.json(data);
    }
  });
});

app.get("/expl_dz", (req, res) => {
  const query =
    "SELECT is_dz, id_expl_dz, num_dz, dz_form, id_disl_dz, work_id FROM exploitation.expl_dz";
  client.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query", err);
      res.status(500).send("Error executing query");
    } else {
      const data = result.rows.map((row) => ({
        is_dz: row.is_dz,
        id_expl_dz: row.id_expl_dz,
        num_dz: row.num_dz,
        dz_form: row.dz_form,
        id_disl_dz: row.id_disl_dz,
        work_id: row.work_id,
      }));
      res.json(data);
    }
  });
});

app.get("/expl_dz/:expl_dz_id", (req, res) => {
  const expl_dz_id = req.params.expl_dz_id;
  const query = `
    SELECT id_expl_dz, id_disl_dz, uuid
    FROM exploitation.expl_dz 
    WHERE id_disl_dz = $1
  `;
  const values = [expl_dz_id];

  client.query(query, values, (err, result) => {
    if (err) {
      console.error("Error executing query", err);
      res.status(500).send("Error executing query");
    } else {
      const data = result.rows.map((row) => ({
        id_expl_dz: row.id_expl_dz,
        id_disl_dz: row.id_disl_dz,
        uuid: row.uuid,
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

app.get("/elements/:uuid", (req, res) => {
  const uuid = req.params.uuid;
  const query = `
    SELECT id_elmts, uuid, name_elmns, cnt_elmnt
    FROM exploitation.elements
    WHERE uuid = $1
  `;

  const values = [uuid];

  client.query(query, values, (err, result) => {
    if (err) {
      console.error("Error executing query", err);
      res.status(500).send("Error executing query");
    } else {
      const data = result.rows.map((row) => ({
        id_elmts: row.id_elmts,
        uuid: row.uuid,
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

app.post("/dz", (req, res) => {
  const wktGeom = req.body.geom;
  const num_pdr = req.body.num_pdr;
  const num_sing = req.body.num_sing;

  const query = `
    INSERT INTO exploitation.dz (geom, num_pdr, num_sing)
    VALUES (ST_GeomFromText($1, 4326), $2, $3)
  `;

  const values = [wktGeom, num_pdr, num_sing];

  client.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting data into the database", err);
      res.status(500).send("Error inserting data into the database");
    } else {
      res.json({ message: "Data successfully inserted into the database" });
    }
  });
});

app.post("/work_table", (req, res) => {
  const formWorksData = req.body;
  const uuid = uuidv4();

  const query = `
  INSERT INTO exploitation.work_table (type_work, is_doc, id_doc, address, date_work, pers_work, uuid)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING id_wrk_tbl;
`;

  const values = [
    formWorksData.type_work,
    formWorksData.is_doc,
    formWorksData.id_doc,
    formWorksData.address,
    formWorksData.date_work,
    formWorksData.pers_work,
    uuid,
  ];

  client.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting data into database", err);
      res.status(500).send("Error inserting data into database");
    } else {
      // const newId = result.rows[0].id_wrk_tbl;

      res.json({
        message: "Data successfully inserted into database",
        id_wrk_tbl: uuid,
      });
    }
  });
});

app.post("/expl_dz", (req, res) => {
  const formData = req.body;
  // const uuid = uuidv4();

  const query = `
    INSERT INTO exploitation.expl_dz (is_dz, num_dz, dz_form, id_disl_dz, work_uuid, uuid)
    VALUES ($1, $2, $3, $4, $5, $6)
  `;

  const values = [
    formData.is_dz,
    formData.num_dz,
    formData.dz_form,
    formData.id_disl_dz,
    formData.work_uuid,
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
    INSERT INTO exploitation.elements (uuid, name_elmns, cnt_elmnt)
    VALUES ($1, $2, $3)
  `;

  const values = [formData.tableId, formData.element, formData.quantity];

  client.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting data into database", err);
      res.status(500).send("Error inserting data into database");
    } else {
      res.json({ message: "Data successfully inserted into database" });
    }
  });
});

//delete

app.delete("/elements/:id", (req, res) => {
  const elementId = req.params.id;

  const query = `
    DELETE FROM exploitation.elements
    WHERE id_elmts = $1
  `;

  const values = [elementId];

  client.query(query, values, (err, result) => {
    if (err) {
      console.error("Error deleting data from database", err);
      res.status(500).send("Error deleting data from database");
    } else {
      res.json({ message: "Data successfully deleted from database" });
    }
  });
});

app.delete("/work_table/:id", (req, res) => {
  const idToDelete = req.params.id;

  const query = {
    text: "DELETE FROM exploitation.work_table WHERE id_wrk_tbl = $1 RETURNING id_wrk_tbl",
    values: [idToDelete],
  };

  client.query(query, (err, result) => {
    if (err) {
      console.error("Error executing deletion query", err);
      res.status(500).send("Error executing deletion query");
    } else {
      if (result.rows && result.rows[0] && result.rows[0].id_wrk_tbl) {
        const deletedId = result.rows[0].id_wrk_tbl;
        res.json({
          message: `Record with id_wrk_tbl ${deletedId} successfully deleted`,
          id_wrk_tbl: deletedId,
        });
      } else {
        res.status(404).json({
          message: `Record with id_wrk_tbl ${idToDelete} not found or could not be deleted.`,
        });
      }
    }
  });
});

app.delete("/expl_dz/:work_id", (req, res) => {
  const workIdToDelete = req.params.work_id;

  const query = {
    text: "DELETE FROM exploitation.expl_dz WHERE work_id = $1",
    values: [workIdToDelete],
  };

  client.query(query, (err, result) => {
    if (err) {
      console.error("Error executing deletion query", err);
      res.status(500).send("Error executing deletion query");
    } else {
      res.json({
        message: `Records with work_id ${workIdToDelete} successfully deleted`,
      });
    }
  });
});

app.delete("/expl_dz/table/:rowId", (req, res) => {
  const rowIdToDelete = req.params.rowId;

  const query = {
    text: "DELETE FROM exploitation.expl_dz WHERE id_disl_dz = $1",
    values: [rowIdToDelete],
  };

  client.query(query, (err, result) => {
    if (err) {
      console.error("Error executing deletion query", err);
      res.status(500).send("Error executing deletion query");
    } else {
      res.json({
        message: `Records with work_id ${rowIdToDelete} successfully deleted`,
      });
    }
  });
});

app.delete("/elements/table/:uuid", (req, res) => {
  const rowIdExplDzToDelete = req.params.rowId;

  const query = {
    text: "DELETE FROM exploitation.elements WHERE uuid IN (SELECT uuid FROM exploitation.expl_dz WHERE uuid = $1)",
    values: [rowIdExplDzToDelete],
  };

  client.query(query, (err, result) => {
    if (err) {
      console.error("Error executing deletion query", err);
      res.status(500).send("Error executing deletion query");
    } else {
      const deletedCount = result.rowCount;
      res.json({
        message: `${deletedCount} row(s) successfully deleted from elements`,
        rows_deleted: deletedCount,
      });
    }
  });
});

app.delete("/elements/:id_expl_dz", (req, res) => {
  const idExplDzToDelete = req.params.id_expl_dz;

  const query = {
    text: "DELETE FROM exploitation.elements WHERE expl_dz_id IN (SELECT id_expl_dz FROM exploitation.expl_dz WHERE id_expl_dz = $1)",
    values: [idExplDzToDelete],
  };

  client.query(query, (err, result) => {
    if (err) {
      console.error("Error executing deletion query", err);
      res.status(500).send("Error executing deletion query");
    } else {
      const deletedCount = result.rowCount;
      res.json({
        message: `${deletedCount} row(s) successfully deleted from elements`,
        rows_deleted: deletedCount,
      });
    }
  });
});

//put
app.put("/elements/:id", (req, res) => {
  const elementId = req.params.id;
  const { element, quantity } = req.body;

  const query = `
    UPDATE exploitation.elements 
    SET name_elmns = $1, cnt_elmnt = $2
    WHERE id_elmts = $3
  `;

  const values = [element, quantity, elementId];

  client.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating data in the database", err);
      res.status(500).send("Error updating data in the database");
    } else {
      res.json({ message: "Data successfully updated in the database" });
    }
  });
});
