const { Sequelize, QueryTypes } = require("sequelize")

const sequelize = new Sequelize('HorseRaces', 'andrew', 'postgres', {
  dialect: 'postgres',
  host: 'localhost',
});


function logSuccess() {
  console.log('Успешное соединение');
}

function logError(error) {
  console.log('Не успешное соединение');
  console.log(error.message);
}

async function testConnection() {
  try {
    await sequelize.authenticate();
    logSuccess();
  } catch (error) {
    logError(error);
  }
}

//Создание таблиц
async function createTable() {
  const sql = `create table entries(
    id serial primary key,
    race_id int references races(id),
    jockey_id int references jockeys(id),
    horse_id int references horses(id),
    created_at date,
    update_at date
  )` ;
  try {
    await sequelize.query(sql);
    console.log('Таблица успешно создана');
  } catch (error) {
    console.log(error.message);
  }
}

async function fullTables() {
  const sqlRace = `insert into races (name, location, created_at, update_at) values
  ('Moscow Style', 'Russia', NOW(), NOW()),
  ('Seul Time', 'South Korea', NOW(), NOW()),
  ('Brasilian Carnaval', 'Brasilia', NOW(), NOW()),
  ('Throw Pyramids', 'Egypt', NOW(), NOW())`
  const sqlJockey = `insert into jockeys (name, created_at, update_at) values
  ('Garret', NOW(), NOW()),
  ('Ludwig', NOW(), NOW()),
  ('Ness', NOW(), NOW()),
  ('Las', NOW(), NOW())`
  const sqlHorses = `insert into horses (name, breed, created_at, update_at) values
  ('Pompon', 'blue-red', NOW(), NOW()),
  ('Sweetheart', 'bloody red', NOW(), NOW()),
  ('Silent', 'white with grey clouds', NOW(), NOW()),
  ('Smurf', 'deep violet', NOW(), NOW())`
  const sqlEntries = `insert into entries (race_id, jockey_id, horse_id, created_at, update_at) values
  (2, 4, 1, NOW(), NOW()),
  (4, 3, 2, NOW(), NOW()),
  (1, 2, 3, NOW(), NOW()),
  (3, 1, 4, NOW(), NOW())`
  try {
    await sequelize.query(sqlRace);
    await sequelize.query(sqlJockey);
    await sequelize.query(sqlHorses);
    await sequelize.query(sqlEntries);
    console.log('УСПЕХ!!!!!!');
  }
  catch (error) {
    console.log(error.message);
  }
};


async function getDerbyForHorse(name) {
  const sql = `
  select h.name, r.location from horses as h
  join entries as e on e.horse_id = h.id 
  join races as r on e.race_id = r.id where h.name = :name; 
  `
  const options = {
    type: QueryTypes.SELECT,
    replacements: {
      name
    }
  }
  try {
    const results = await sequelize.query(sql, options);
    console.log(results);
  } catch (error) {
    console.log('Не получилось!');
    console.log(error.message);
  }
}

// getDerbyForHorse('Pompon');
// sequelize.query(
//   `
//   select h.name, r.name, r.location from horses as h
//   join entries as e on e.horse_id = h.id 
//   join races as r on e.race_id = r.id where h.name = :name; 
//   `,
//   {
//     type: QueryTypes.SELECT,
//     replacements: {
//       name: 'Pompon'
//     }
//   }
// ).then(console.log)
//   .catch(error => console.log('Неудача'))

async function getJockeyByHorse() {
  const sql = `
    select jockeys.name as jockey_name, horses.name as horses_name from jockeys  join entries as e on 
    e.jockey_id = jockeys.id join horses on e.horse_id = horses.id where horses.name = ?; 
    `
  const options = {
    type: QueryTypes.SELECT,
    replacements: ['Pompon']
  }
  try {
    const results = await sequelize.query(sql, options);
    console.log(results);
  } catch (error) {
    console.log('Не получилось!');
    console.log(error.message);
  }
}


getJockeyByHorse('Sweetheart');
