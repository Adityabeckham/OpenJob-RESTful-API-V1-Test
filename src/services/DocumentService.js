const { nanoid } = require('nanoid');
const pool = require('../config/database');
const { InvariantError, NotFoundError } = require('../utils/ClientError');

class DocumentService {
  async addDocument({ userId, fileName, filePath, fileType, fileSize }) {
    const id = `doc-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO documents(id, user_id, file_name, file_path, file_type, file_size) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, userId, fileName, filePath, fileType || null, fileSize || null],
    };

    const result = await pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add document');
    }

    return result.rows[0].id;
  }

  async getDocuments() {
    const result = await pool.query('SELECT * FROM documents ORDER BY created_at DESC');
    return result.rows;
  }

  async getDocumentById(id) {
    const query = {
      text: 'SELECT * FROM documents WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Document not found');
    }

    return result.rows[0];
  }

  async deleteDocument(id) {
    const query = {
      text: 'DELETE FROM documents WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Document not found');
    }
  }
}

module.exports = new DocumentService();
