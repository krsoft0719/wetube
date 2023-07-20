import multer from 'multer'

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next()
  } else {
    req.flash('error', 'Log in first.')
    return res.redirect('/login')
  }
}

export const videoUpload = multer({
  // dest: 'uploads/videos/',
  // limits: {
  //   fileSize: 10000000,
  // },
  // storage: isHeroku ? s3VideoUploader : undefined,
})
