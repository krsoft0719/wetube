import express from 'express'
import {
  see,
  getUpload,
  getEdit,
  postEdit,
  postUpload,
  deleteVideo,
} from '../controllers/videoController'
import { protectorMiddleware, videoUpload } from '../middlewares'

const videoRouter = express.Router()

videoRouter.get('/:id', see)
// videoRouter
//   .route('/:id([0-9a-f]{24})/edit')
//   .all(protectorMiddleware)
//   .get(getEdit)
//   .post(postEdit)
// videoRouter
//   .route('/:id([0-9a-f]{24})/delete')
//   .all(protectorMiddleware)
//   .get(deleteVideo)
// videoRouter
//   .route('/upload')
//   .all(protectorMiddleware)
//   .get(getUpload)
//   .post(videoUpload.fields([{ name: 'video' }, { name: 'thumb' }]), postUpload)

export default videoRouter
