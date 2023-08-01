const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  user: process.env.POSTGRE_USER,
  host: process.env.POSTGRE_HOST, //
  database: process.env.POSTGRE_DB,
  password: process.env.POSTGRE_PW,
  port: process.env.POSTGRE_PORT,
})
/* */

// pool.connect((err) => {
//   if (err) console.log(err)
//   else {
//     console.log('데이터 베이스 연결 성공! ')
//   }
// })

module.exports = {
  querys: async (text, params) => {
    try {
      if (process.env.SHOW_QUERY) {
        // console.log(`Query:
        // ${text}
        // ` .brightBlue)
        console.log(`Query: 
            ${text}
            `)
      }
      let result = await pool.query(text, params)
      if (process.env.SHOW_QUERY_RESULT) {
        switch (process.env.RESULT_OPTION) {
          case 'short':
            // console.log(`Query Result[${result['command']}]: ${result['rowCount']}` .brightMagenta)
            console.log(
              `Query Result[${result['command']}]: ${result['rowCount']}`,
            )
            break
          case 'detail':
            console.log(result['rows'])
            // console.log(`Query Result[${result['command']}]: ${result['rowCount']}` .brightMagenta)
            console.log(
              `Query Result[${result['command']}]: ${result['rowCount']}`,
            )
            break
        }
      }

      return result
    } catch (e) {
      // console.log(`Query ${e}` .green)
      console.log(`Query  Error : ${e}`)
    }
  },
}
