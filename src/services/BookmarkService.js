const { nanoid } = require('nanoid');
const pool = require('../config/database');
const { InvariantError, NotFoundError } = require('../utils/ClientError');

class BookmarkService {
  async addBookmark(userId, jobId) {
    const id = `bookmark-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO bookmarks(id, user_id, job_id) VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, jobId],
    };

    const result = await pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add bookmark');
    }

    return result.rows[0].id;
  }

  async getBookmarksByUserId(userId) {
    const query = {
      text: `SELECT b.*, j.title AS job_title, c.name AS company_name
             FROM bookmarks b
             LEFT JOIN jobs j ON b.job_id = j.id
             LEFT JOIN companies c ON j.company_id = c.id
             WHERE b.user_id = $1
             ORDER BY b.created_at DESC`,
      values: [userId],
    };

    const result = await pool.query(query);
    return result.rows;
  }

  async getBookmarkById(id) {
    const query = {
      text: 'SELECT * FROM bookmarks WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Bookmark not found');
    }

    return result.rows[0];
  }

  async deleteBookmarkByUserAndJob(userId, jobId) {
    const query = {
      text: 'DELETE FROM bookmarks WHERE user_id = $1 AND job_id = $2 RETURNING id',
      values: [userId, jobId],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Bookmark not found');
    }
  }
}

module.exports = new BookmarkService();
