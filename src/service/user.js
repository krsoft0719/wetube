let pgdb = require('../repo-pg/config')
require('dotenv').config()
import bcrypt from 'bcrypt'
//회원가입
async function join(userData) {
  let password = userData.password
  password = await bcrypt.hash(password, 5)
  console.log(password)
  let queryTemp = `INSERT INTO "user" (we_email, we_username, we_password, we_name, we_location) 
        VALUES ('${userData.email}', '${userData.username}', '${password}', '${userData.name}', '${userData.location}')`
  await pgdb.querys(queryTemp)
}

// 회원가입할 때 유저 체크
async function findExistsUser(username, email) {
  let queryTemp = `SELECT we_email, we_username from "user" WHERE we_email = '${email}' AND 
  we_username = '${username}'`
  const { rows } = await pgdb.querys(queryTemp)
  return rows
}

// 로그인할 때 유저체크
async function login(username) {
  let queryTemp = `SELECT * FROM "user" WHERE we_username = '${username}'`
  const { rows } = await pgdb.querys(queryTemp)
  return rows
}

module.exports = {
  join,
  findExistsUser,
  login,
}
