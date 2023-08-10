import express from 'express'
import {
  watch,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
  deleteVideo,
} from '../controllers/videoController'
import { protectorMiddleware, videoUpload } from '../middlewares'

const videoRouter = express.Router()

videoRouter.route('/:id/delete').all(protectorMiddleware).get(deleteVideo)
videoRouter
  .route('/upload')
  .all(protectorMiddleware)
  .get(getUpload)
  .post(videoUpload.single('video'), postUpload)
videoRouter
  .route('/:id/edit')
  .all(protectorMiddleware)
  .get(getEdit)
  .post(videoUpload.single('video'), postEdit)

videoRouter.get('/:id', watch)
export default videoRouter
