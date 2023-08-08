import express from 'express'
import {
  watch,
  getUpload,
  getEdit,
  postEdit,
  postUpload,
  deleteVideo,
} from '../controllers/videoController'
import { publicOnlyMiddeware, protectorMiddleware } from '../middlewares'

const videoRouter = express.Router()

videoRouter.route('/:id/delete').all(protectorMiddleware).get(deleteVideo)
videoRouter.get('/:id', watch)
videoRouter
  .route('/upload')
  .all(protectorMiddleware)
  .get(getUpload)
  .post(postUpload)
videoRouter
  .route('/:id/edit')
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit)

export default videoRouter
