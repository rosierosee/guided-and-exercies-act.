const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log('db ' + connection.state);
});

class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }

  async getAllData() {
    try {
      const query = "SELECT * FROM students;";
      const response = await new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      return response;
    } catch (error) {
      console.error('Error fetching data from database:', error);
      throw error;
    }
  }

  async getDataById(id) {
    try {
      const query = "SELECT * FROM students WHERE id = ?";
      const response = await new Promise((resolve, reject) => {
        connection.query(query, [id], (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results[0]);
        });
      });
      return response;
    } catch (error) {
      console.error('Error fetching data by ID from database:', error);
      throw error;
    }
  }

  async updateNameById(id, name, program) {
    try {
      const query = "UPDATE students SET name = ?, program = ? WHERE id = ?";
      const response = await new Promise((resolve, reject) => {
        connection.query(query, [name, program, id], (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results.affectedRows > 0); // returns true if a row was updated
        });
      });
      return response;
    } catch (error) {
      console.error('Error updating data in database:', error);
      throw error;
    }
  }

  async insertData(name, program) {
    try {
      const query = "INSERT INTO students (name, program, date_added) VALUES (?, ?, NOW())";
      const response = await new Promise((resolve, reject) => {
        connection.query(query, [name, program], (err, results) => {
          if (err) {
            console.error('Error inserting data:', err.message);
            reject(new Error(err.message));
          }
          resolve(results.insertId);
        });
      });
      return response;
    } catch (error) {
      console.error('Error inserting data into database:', error);
      throw error;
    }
  }

  async deleteRowById(id) {
    try {
      const query = "DELETE FROM students WHERE id = ?";
      const response = await new Promise((resolve, reject) => {
        connection.query(query, [id], (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results.affectedRows > 0); // returns true if a row was deleted
        });
      });
      return response;
    } catch (error) {
      console.error('Error deleting data from database:', error);
      throw error;
    }
  }

  async searchByName(name) {
    try {
      const query = "SELECT * FROM students WHERE name LIKE ?";
      const response = await new Promise((resolve, reject) => {
        connection.query(query, [`%${name}%`], (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      return response;
    } catch (error) {
      console.error('Error searching data in database:', error);
      throw error;
    }
  }
}

let instance = null;
module.exports = DbService;


