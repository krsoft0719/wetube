import express from 'express'
import videoRouter from './routers/videoRouter'
import userRouter from './routers/userRouter'
import rootRouter from './routers/rootRouter'
import morgan from 'morgan'
import session from 'express-session'
import { localsMiddleware } from './middlewares'
const pg = require('pg')
const pgSession = require('connect-pg-simple')(session)
import 'dotenv/config'
const app = express()
const pgPool = new pg.Pool({
  user: process.env.POSTGRE_USER,
  host: process.env.POSTGRE_HOST,
  database: process.env.POSTGRE_DB,
  password: process.env.POSTGRE_PW,
  port: process.env.POSTGRE_PORT,
})
const logger = morgan('dev')

app.set('view engine', 'pug')
app.set('views', process.cwd() + '/src/views')
app.use(logger)

app.disable('x-powered-by')
app.use(express.urlencoded({ extended: true }))

app.use(
  session({
    store: new pgSession({
      pool: pgPool,
      tableName: 'user_sessions',
    }),
    secret: process.env.COOKIE_SECRET,
    resave: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    saveUninitialized: false,
  }),
)

app.use(localsMiddleware)

app.use('/', rootRouter)
app.use('/videos', videoRouter)
app.use('/users', userRouter)

export default app
