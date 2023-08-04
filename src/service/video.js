let pgdb = require('../repo-pg/config')

async function getVideo() {
  let queryTemp = `SELECT * FROM video ORDER BY createdat DESC`

  const { rows } = await pgdb.querys(queryTemp)
  return rows
}

async function getVideoDetail(id) {
  let queryTemp = `Select * FROM video WHERE video_pk ='${id}'`
  const { rows } = await pgdb.querys(queryTemp)
  return rows
}

async function postVideo(title, description, hash) {
  let queryTemp = `INSERT INTO video (title, description, hashtags)
                    VALUES ('${title}', '${description}', '{${hash}}')`
  const { rows } = await pgdb.querys(queryTemp)
  return rows
}

async function updateVideo(title, description, hash, id) {
  let queryTemp = `UPDATE video SET title = '${title}', description = '${description}', hashtags = '{${hash}}' where video_pk = '${id}'`
  const { rows } = await pgdb.querys(queryTemp)
  return rows
}

async function deleteVideo(id) {
  let queryTemp = `DELETE FROM video WHERE video_pk = '${id}'`
  await pgdb.querys(queryTemp)
}

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
