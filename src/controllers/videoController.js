let svc = require('../service/video')

export const home = async (req, res) => {
  const videos = await svc.getVideo()
  return res.render('home', { pageTitle: 'Home', videos })
}

export const watch = async (req, res) => {
  const { id } = req.params
  console.log('id ', id)
  const [video] = await svc.getVideoDetail(id)
  if (video) {
    return res.render('watch', {
      pageTitle: 'Watching',
      video,
    })
  }
  return res.render('404', { pageTitle: 'Video not found' })
}

export const getUpload = (req, res) => {
  const { id } = req.params
  return res.render('upload', {
    pageTitle: `Upload Video  `,
  })
}

export const postUpload = (req, res) => {
  try {
    const { title, description, hash } = req.body
    const hashtags = hash.split(',').map((word) => `#${word}`)

    svc.postVideo(title, description, hashtags)
  } catch (error) {
    return res.render('upload', {
      pageTitle: 'upload Video',
      errorMessage: error._message,
    })
  }

  return res.redirect('/')
}

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
export const postEdit = async (req, res) => {
  const { id } = req.params
  const [video] = await svc.getVideoDetail(id)

  if (!video) {
    return res.render('404', { pageTitle: 'Video not found' })
  }
  const { title, description, hashtags } = req.body
  await svc.updateVideo(title, description, hashtags, id)
  return res.redirect(`/videos/${id}`)
}

export const search = (req, res) => res.send('Search')
export const upload = (req, res) => res.send('Upload')
export const deleteVideo = (req, res) => {
  return res.send('Delete Video')
}
