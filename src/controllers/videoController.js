let svc = require('../service/video')
// 해쉬태그 만드는 함수
const formatHashtags = (hashtags) =>
  hashtags.split(',').map((word) => (word.startsWith('#') ? word : `#${word}`))

//메인 페이지
export const home = async (req, res) => {
  const videos = await svc.getVideo()
  console.log('!!! ', videos)
  return res.render('home', { pageTitle: 'Home', videos })
}
// 선택한 비디오 보는 페이지
export const watch = async (req, res) => {
  const { id } = req.params
  const {
    user: { user_pk },
  } = req.session

  const [video] = await svc.getVideoDetail(id)

  if (video) {
    return res.render('video/watch', {
      pageTitle: 'Watching',
      video,
      upLoadUser: video.we_user_pk,
      visitor: user_pk,
    })
  }
  return res.render('404', {
    pageTitle: 'Video not found',
  })
}
// 비디오 등록 페이지
export const getUpload = (req, res) => {
  const { id } = req.params
  return res.render('video/upload', {
    pageTitle: `Upload Video  `,
  })
}
// 비디오 등록
export const postUpload = async (req, res) => {
  const { path } = req.file
  const { user } = req.session
  const { title, description, hash } = req.body
  try {
    const hashtags = formatHashtags(hash)

    await svc.postVideo(title, description, hashtags, path, user.user_pk)
    return res.redirect('/')
  } catch (error) {
    console.log('error ', error)
    return res.render('video/upload', {
      pageTitle: 'upload Video',
      errorMessage: error,
    })
  }
}
// 비디오 편집 페이지
export const getEdit = async (req, res) => {
  const { id } = req.params
  const { user } = req.session
  const [video] = await svc.getVideoDetail(id)
  if (!video) {
    return res.render('404', { pageTitle: 'Video not Found' })
  }
  if (video.we_user_pk !== user.user_pk) {
    return res.status(403).redirect('/')
  }
  return res.render('users/edit', {
    pageTitle: `Editing : ${video.title}`,
    video,
  })
}
// 비디오 편집
export const postEdit = async (req, res) => {
  const { id } = req.params
  const [video] = await svc.getVideoDetail(id)

  if (!video) {
    return res.render('404', { pageTitle: 'Video not found' })
  }
  const { title, description, hashtags } = req.body

  let hashs = formatHashtags(hashtags)

  await svc.updateVideo(title, description, hashs, id)
  return res.redirect(`/videos/${id}`)
}
// 검색
export const search = async (req, res) => {
  const { keyword } = req.query

  if (keyword) {
    let videos = ([][videos] = await svc.searchVideo(keyword))
    return res.render('search', { pageTitle: 'Search', videos })
  }
  return res.render('search', { pageTitle: 'Search' })
}
// 업로드
export const upload = (req, res) => {
  console.log('업로드 ')
}
// 비디오 삭제
export const deleteVideo = async (req, res) => {
  const { id } = req.params
  await svc.deleteVideo(id)

  return res.redirect('/')
}
