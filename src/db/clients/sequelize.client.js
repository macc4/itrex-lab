import { Sequelize } from 'sequelize';
import config from 'config';

import User from '../models/user.model.js';
import Patient from '../models/patient.model.js';
import Resolution from '../models/resolution.model.js';

import passwordUtils from '../../utils/passwordUtils.js';

const db = {};

const sequelize = new Sequelize(
  config.get('db.sequelize.db'),
  config.get('db.sequelize.user'),
  config.get('db.sequelize.password'),
  {
    host: process.env.MYSQL_HOST || config.get('db.sequelize.host'),
    dialect: config.get('db.sequelize.dialect'),
  },
);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = User(sequelize, Sequelize);
db.patients = Patient(sequelize, Sequelize);
db.resolutions = Resolution(sequelize, Sequelize);

// ASSOCIATIONS
db.users.hasOne(db.patients, {
  // foreignKey: 'patientId',
  onDelete: 'cascade',
});
db.patients.belongsTo(db.users, {
  foreignKey: 'userId',
});

db.patients.hasMany(db.resolutions, {
  onDelete: 'cascade',
  truncate: true,
  hooks: true,
});
db.resolutions.belongsTo(db.patients, {
  foreignKey: 'patientId',
});

db.connect = async () => {
  await db.sequelize.query(
    `CREATE DATABASE IF NOT EXISTS \`${config.get('db.sequelize.db')}\`;`,
  );

  await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
  await db.sequelize.sync({ force: true });
  await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });

  // create a default admin role
  await db.users.create({
    email: 'admin@gmail.com',
    password: await passwordUtils.hashPassword('12345678'),
    name: 'Admin',
    role: 'admin',
  });

  console.log('-----------------------------'); // eslint-disable-line no-console
  console.log('SQL database has been connected.'); // eslint-disable-line no-console
};

export default db;