import multer from 'multer'

export const localsMiddleware = (req, res, next) => {
  console.log('미들웨어 세션', req.session)
  res.locals.loggedIn = Boolean(req.session.loggedIn)
  res.locals.siteName = 'Wetube'
  res.locals.loggedInUser = req.session.user
  next()
}

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
