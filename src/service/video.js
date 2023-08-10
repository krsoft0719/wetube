let pgdb = require('../repo-pg/config')
// 비디오 조회
async function getVideo() {
  let queryTemp = `SELECT * FROM video ORDER BY createdat DESC`

  const { rows } = await pgdb.querys(queryTemp)
  return rows
}
// 비디오 디테일
async function getVideoDetail(id) {
  let queryTemp = `SELECT v.*, we_name FROM user_account ua RIGHT JOIN 
                    (SELECT * FROM video v WHERE video_pk = '${id}') v
                    ON ua.user_pk::varchar = v.we_user_pk`
  const { rows } = await pgdb.querys(queryTemp)
  return rows
}

// 비디오 등록
async function postVideo(title, description, hash, video, owner) {
  let queryTemp = `INSERT INTO video (title, description, hashtags, file_url, we_user_pk )
                    VALUES ('${title}', '${description}', '{${hash}}', '${video}', '${owner}')`
  const { rows } = await pgdb.querys(queryTemp)
  return rows
}

// 비디오 수정
async function updateVideo(title, description, hash, id) {
  let queryTemp = `UPDATE video SET title = '${title}', description = '${description}', hashtags = '{${hash}}' where video_pk = '${id}'`
  const { rows } = await pgdb.querys(queryTemp)
  return rows
}

// 비디오 삭제
async function deleteVideo(id) {
  let queryTemp = `DELETE FROM video WHERE video_pk = '${id}'`
  await pgdb.querys(queryTemp)
}

//비디오 검색
async function searchVideo(keyword) {
  let queryTemp = `SELECT * FROM video WHERE title like '%${keyword}%'`
  const { rows } = await pgdb.querys(queryTemp)
  return rows
}

module.exports = {
  getVideo,
  postVideo,
  getVideoDetail,
  updateVideo,
  deleteVideo,
  searchVideo,
}
