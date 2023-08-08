import multer from 'multer'

export const localsMiddleware = (req, res, next) => {
  console.log('미들웨어 세션', req.session)
  res.locals.loggedIn = Boolean(req.session.loggedIn)
  res.locals.siteName = 'Wetube'
  res.locals.loggedInUser = req.session.user || {}
  next()
}
// 로그인 되어 있지 않은 상태에서 로그인이 되야 갈 수 있는 페이지에 갔을 때
export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next()
  } else {
    // req.flash('error', 'Log in first.')
    return res.redirect('/login')
  }
}

// 로그인 했는데 또 로그인하려고 할 때 그러지 못하게 막기
export const publicOnlyMiddeware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next()
  } else {
    return res.redirect('/')
  }
}

export const videoUpload = multer({
  // dest: 'uploads/videos/',
  // limits: {
  //   fileSize: 10000000,
  // },
  // storage: isHeroku ? s3VideoUploader : undefined,
})
