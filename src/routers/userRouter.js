import express from 'express'
import {
  logout,
  see,
  startGithubLogin,
  finishGithubLogin,
  getEdit,
  postEdit,
  getChangePassword,
  postgetChangePassword,
} from '../controllers/userController'
import {
  protectorMiddleware,
  publicOnlyMiddeware,
  avatarUpload,
} from '../middlewares'

const userRouter = express.Router()

userRouter.get('/logout', protectorMiddleware, logout)
userRouter
  .route('/edit')
  .all(protectorMiddleware)
  .get(getEdit)
  .post(avatarUpload.single('avatar'), postEdit)

userRouter
  .route('/change-password')
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postgetChangePassword)
userRouter.get('/:id', see)
userRouter.get('/github/start', publicOnlyMiddeware, startGithubLogin)
userRouter.get('/github/finish', publicOnlyMiddeware, finishGithubLogin)

export default userRouter
