const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors()); // cors for reactivity with the server
app.use(express.json());

// check status to see if the port is up
app.get('/api/health', async (req, res) => {
  try {
    let result = await db.query('SELECT current_user, now()');
    res.json({
      status: "Alive",
      worker: result.rows[0].current_user,
      server_time: result.rows[0].now
    });
  } catch (err) {
    res.status(500).json({ status: "Error", message: err.message });
  }
});

// search logic -- build search parameters from the received URL
app.get("/api/search", async (req, res) => {
    const { origin, destination, date, transport_type } = req.query;

    try {
      // a no date search filter will result into getting and using the day of the search
      if (!date) {
        date = new Date().toISOString().split("T")[0];
        console.log(`No date provided to the query. Setting default to the day of search: ${date}`);
      }

      let queryText = 'SELECT * FROM routes WHERE 1=1';
      let queryParams = [];

      if (origin) {
        queryParams.push(origin);
        queryText += ` AND origin ILIKE $${queryParams.length}`; // ILIKE -- specific for PostgreSQL, used for pattern matching in a string, ignores case distinctions
      }

      if (destination) {
        queryParams.push(destination);
        queryText += ` AND destination ILIKE $${queryParams.length}`;
      }

      if (transport_type) {
        queryParams.push(transport_type);
        queryText += ` AND transport_type ILIKE $${queryParams.length}`;
      }

      // the date is given here no matter if the user omits to set it, from the selection above
      queryParams.push(date);
      queryText += ` AND departure_date::date = $${queryParams.length}`;

      queryText += ' ORDER BY departure_time ASC';

      // result awaits the query response from the db
      const result = await db.query(queryText, queryParams);

      if (result.rows.length === 0) {
        return res.json({
          success: true,
          message: "No routes found for this search.",
          data: []
        });
      }

      res.json({
        success: true,
        count: result.rows.length,
        data: result.rows
      });

    } catch (err){
      console.error("Database error: ", err.message);
      res.status(500).json({ status: "Error", message: err.message });
    }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('API running on port 3000');
});