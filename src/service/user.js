let pgdb = require('../repo-pg/config')
require('dotenv').config()
import bcrypt from 'bcrypt'
// 회원가입(비밀번호)
async function join(userData) {
  let password = userData.password
  password = await bcrypt.hash(password, 5)

  let queryTemp = `INSERT INTO user_account (we_email, we_username, we_password, we_name, we_location) 
        VALUES ('${userData.email}', '${userData.username}', '${password}', '${userData.name}', '${userData.location}')`
  await pgdb.querys(queryTemp)
}

// 소셜로그인 회원가입
async function join_social(userData) {
  let queryTemp = `
    WITH new_user AS (
    INSERT  INTO user_account (we_email, we_username, we_name, we_location, we_avatar_url, we_social)
    VALUES ('${userData.we_email}', '${userData.we_username}', '${userData.we_name}', '${userData.we_location}','${userData.we_avatar_url}', '${userData.we_social}')
      RETURNING we_email, we_username, we_name, we_location, we_avatar_url 
    )
    INSERT INTO user_social (we_email, we_username, we_name, we_location, we_avatar_url)
    SELECT we_email, we_username, we_name, we_location, we_avatar_url 
    FROM new_user
    `

  await pgdb.querys(queryTemp)
}

// 회원가입할 때 유저 체크
async function findExistsUser(username, email) {
  let queryTemp = `SELECT we_email, we_username from user_account WHERE we_email = '${email}' AND 
  we_username = '${username}'`
  const { rows } = await pgdb.querys(queryTemp)
  return rows
}

// 로그인할 때 유저체크
async function login(username) {
  let queryTemp = `SELECT * FROM user_account WHERE we_username = '${username}'`
  const { rows } = await pgdb.querys(queryTemp)
  return rows
}
// 소셜 로그인할 때 이메일로 유저 체크
async function findExistScoial(email) {
  let queryTemp = `Select * FROM user_account WHERE we_email = '${email}'`
  const { rows } = await pgdb.querys(queryTemp)
  return rows
}

// 프로필 수정
async function updateProfile(user_pk, email, username, name, location) {
  let queryTemp = `UPDATE user_account 
                    SET we_email='${email}',
                        we_username='${username}',
                        we_name='${name}',
                        we_location='${location}' 
                    WHERE user_pk = '${user_pk}'`
  await pgdb.querys(queryTemp)
}

// 비밀번호 수정
async function updatePassword(user_pk, password) {
  let hashpassword = await bcrypt.hash(password, 5)

  let queryTemp = `UPDATE user_account 
                   SET we_password = '${hashpassword}'
                   WHERE user_pk = '${user_pk}'`

  await pgdb.querys(queryTemp)
}

module.exports = {
  join,
  join_social,
  findExistsUser,
  login,
  findExistScoial,
  updateProfile,
  updatePassword,
}
