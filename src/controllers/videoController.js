let svc = require('../service/video')
// 해쉬태그 만드는 함수
const formatHashtags = (hashtags) =>
  hashtags.split(',').map((word) => (word.startsWith('#') ? word : `#${word}`))

//메인 페이지
export const home = async (req, res) => {
  const videos = await svc.getVideo()
  return res.render('home', { pageTitle: 'Home', videos })
}
// 선택한 비디오 보는 페이지
export const watch = async (req, res) => {
  const { id } = req.params
  const [video] = await svc.getVideoDetail(id)
  if (video) {
    return res.render('watch', {
      pageTitle: 'Watching',
      video,
    })
  }
  return res.render('404', { pageTitle: 'Video not found' })
}
// 비디오 등록 페이지
export const getUpload = (req, res) => {
  const { id } = req.params
  return res.render('upload', {
    pageTitle: `Upload Video  `,
  })
}
// 비디오 등록
export const postUpload = (req, res) => {
  try {
    const { title, description, hash } = req.body
    const hashtags = formatHashtags(hash)

    svc.postVideo(title, description, hashtags)
  } catch (error) {
    return res.render('upload', {
      pageTitle: 'upload Video',
      errorMessage: error._message,
    })
  }

  return res.redirect('/')
}
// 비디오 편집 페이지
export const getEdit = async (req, res) => {
  const { id } = req.params
  const [video] = await svc.getVideoDetail(id)
  if (!video) {
    return res.render('404', { pageTitle: 'Video not Found' })
  }
  return res.render('edit', {
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

export const search = async (req, res) => {
  const { keyword } = req.query

  if (keyword) {
    let videos = ([][videos] = await svc.searchVideo(keyword))
    return res.render('search', { pageTitle: 'Search', videos })
  }
  console.log('AAA')
  return res.render('search', { pageTitle: 'Search' })
}
export const upload = (req, res) => res.send('Upload')
export const deleteVideo = async (req, res) => {
  const { id } = req.params
  await svc.deleteVideo(id)

  return res.redirect('/')
}
