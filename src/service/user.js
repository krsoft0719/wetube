let pgdb = require('../repo-pg/config')
require('dotenv').config()
import bcrypt from 'bcrypt'
//회원가입
async function join(userData) {
  let password = ''
  if (userData.password) {
    console.log('Aa')
    password = userData.password
    password = await bcrypt.hash(password, 5)
  }

  let queryTemp = `INSERT INTO "user" (we_email, we_username, we_password, we_name, we_location, we_github_only, we_avatar_url) 
        VALUES ('${userData.we_email}', '${userData.we_username}', '${password}', '${userData.we_name}', '${userData.we_location}', '${userData.we_scoialOnly}', '${userData.we_avatar_url}')`
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
// 통합로그인할 때 이메일로 유저 체크
async function findExistEmail(email) {
  let queryTemp = `Select we_email, we_username, we_name from "user" WHERE we_email = '${email}'`
  const { rows } = await pgdb.querys(queryTemp)
  return rows
}

module.exports = {
  join,
  findExistsUser,
  login,
  findExistEmail,
}
