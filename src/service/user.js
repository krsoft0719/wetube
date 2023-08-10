let pgdb = require('../repo-pg/config')
require('dotenv').config()
import bcrypt from 'bcrypt'
// 회원가입(비밀번호)
async function join(userData) {
  let password = userData.password
  password = await bcrypt.hash(password, 5)

  let queryTemp = `INSERT INTO user_account (we_email, we_user_id, we_password, we_name, we_location) 
        VALUES ('${userData.email}', '${userData.userId}', '${password}', '${userData.name}', '${userData.location}')`
  await pgdb.querys(queryTemp)
}

// 소셜로그인 회원가입
async function join_social(userData) {
  let queryTemp = `
    WITH new_user AS (
    INSERT  INTO user_account (we_email, we_user_id, we_name, we_location, we_avatar_url, we_social)
    VALUES ('${userData.we_email}', '${userData.we_user_id}', '${userData.we_name}', '${userData.we_location}','${userData.we_avatar_url}', '${userData.we_social}')
      RETURNING we_email, we_user_id, we_name, we_location, we_avatar_url 
    )
    INSERT INTO user_social (we_email, we_user_id, we_name, we_location, we_avatar_url)
    SELECT we_email, we_user_id, we_name, we_location, we_avatar_url 
    FROM new_user
    `

  await pgdb.querys(queryTemp)
}

// 회원가입할 때 유저 체크
async function findExistsUser(userId, email) {
  let queryTemp = `SELECT we_email, we_user_id from user_account WHERE we_email = '${email}' AND 
  we_user_id = '${userId}'`
  const { rows } = await pgdb.querys(queryTemp)
  return rows
}

// 로그인할 때 유저체크
async function login(userId) {
  let queryTemp = `SELECT * FROM user_account WHERE we_user_id = '${userId}'`
  const { rows } = await pgdb.querys(queryTemp)
  return rows
}
// 소셜 로그인할 때 이메일로 유저 체크
async function findExistScoial(email) {
  let queryTemp = `Select * FROM user_account WHERE we_email = '${email}'`
  const { rows } = await pgdb.querys(queryTemp)
  return rows
}
// 로그인한 유저 찾기
async function findLoginUser(userPk) {
  let queryTemp = `Select * FROM user_account WHERE user_pk = '${userPk}'`
  const { rows } = await pgdb.querys(queryTemp)
  return rows
}

// 프로필 수정
async function updateProfile(user_pk, name, email, location, avatar_url) {
  let queryTemp = `UPDATE user_account 
                    SET we_email='${email}',
                        we_name='${name}',
                        we_location='${location}',
                        we_avatar_url='${avatar_url}' 
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
// 유저프로필에서 올린 영상조회
async function getUserVideo(userPk) {
  let queryTemp = `SELECT *, lib.title, lib.description, lib.file_url, lib.createdat, lib.hashtags FROM user_account ua  JOIN 
                  (SELECT * FROM video WHERE we_user_pk ='${userPk}')lib 
                ON lib.we_user_pk = ua.user_pk::varchar`
  const { rows } = await pgdb.querys(queryTemp)
  return rows
}
module.exports = {
  join,
  join_social,
  findExistsUser,
  login,
  findExistScoial,
  updateProfile,
  updatePassword,
  findLoginUser,
  getUserVideo,
}
