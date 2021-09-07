const mysql = require('mysql');


const Database = function(config) {
  const db = this;
  const pool = mysql.createPool(config);


  db.query = (q) => {

    return new Promise((resolve, reject) => {
      pool.getConnection(function (err, conn) {
        conn.query(q, function (err, rows) {
          conn.release();
          if (err) throw err;
          if(Array.isArray(rows)){
            rows.forEach(row => {
              for (const col in row) {
                if(typeof row[col] == 'object' && row[col]){
                  row[col] = row[col].toString('utf-8');
                }
              }
            });
          }
          resolve(rows);
        });
      });
    });
  }
}
module.exports = Database;
