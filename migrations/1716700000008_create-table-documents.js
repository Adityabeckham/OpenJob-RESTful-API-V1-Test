/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('documents', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    file_name: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    file_path: {
      type: 'TEXT',
      notNull: true,
    },
    file_type: {
      type: 'VARCHAR(100)',
    },
    file_size: {
      type: 'BIGINT',
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('documents');
};
