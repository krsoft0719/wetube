import express from 'express'
import videoRouter from './routers/videoRouter'
import userRouter from './routers/userRouter'
import globalRouter from './routers/globalRouter'
import morgan from 'morgan'

const app = express()
const logger = morgan('dev')
const PORT = 4000

app.set('view engine', 'pug')
app.set('views', process.cwd() + '/src/views')
app.use(logger)
app.use('/', globalRouter)
app.use('/video', videoRouter)
app.use('/users', userRouter)

const handleListening = () =>
  console.log(`Server Listening on port http:localhost:${PORT}`)

app.listen(PORT, handleListening)
