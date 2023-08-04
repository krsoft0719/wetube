import express from 'express'
import {
  watch,
  getUpload,
  getEdit,
  postEdit,
  postUpload,
  deleteVideo,
} from '../controllers/videoController'
const videoRouter = express.Router()

videoRouter.route('/:id/delete').get(deleteVideo)
videoRouter.route('/upload').get(getUpload).post(postUpload)
videoRouter.get('/:id', watch)
videoRouter.route('/:id/edit').get(getEdit).post(postEdit)

export default videoRouter
