import express from 'express'
import { home, search } from '../controllers/videoController'
import {
  getJoin,
  getLogin,
  postJoin,
  postLogin,
} from '../controllers/userController'
import { publicOnlyMiddeware } from '../middlewares'

const rootRouter = express.Router()

rootRouter.get('/', home)
rootRouter.route('/join').all(publicOnlyMiddeware).get(getJoin).post(postJoin)
rootRouter
  .route('/login')
  .all(publicOnlyMiddeware)
  .get(getLogin)
  .post(postLogin)
rootRouter.get('/search', search)

export default rootRouter
