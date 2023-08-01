import express from 'express'
import videoRouter from './routers/videoRouter'
import userRouter from './routers/userRouter'
import globalRouter from './routers/globalRouter'
import morgan from 'morgan'

const app = express()
const logger = morgan('dev')

app.set('view engine', 'pug')
app.set('views', process.cwd() + '/src/views')
app.use(logger)

app.disable('x-powered-by')
app.use(express.urlencoded({ extended: true }))

app.use('/', globalRouter)
app.use('/videos', videoRouter)
app.use('/users', userRouter)

export default app
