const video = document.querySelector('video')
const playBtn = document.querySelector('#play')
const playBtnIcon = playBtn.querySelector('i')
const muteBtn = document.querySelector('#mute')
const muteBtnIcon = muteBtn.querySelector('i')
const volumeRange = document.querySelector('#volume')
const currentTime = document.getElementById('currentTime')
const totalTime = document.getElementById('totalTime')
const timeLine = document.getElementById('timeline')
const fullScreenBtn = document.getElementById('fullScreen')
const fullScreenBtnIcon = fullScreenBtn.querySelector('i')
const videoContainer = document.querySelector('.video_main')
const videoControls = document.getElementById('videoControls')
const volumeArea = document.querySelector('.volumeArea')
const volumeBar = volumeArea.querySelector('input')
const videoTotalControls = document.querySelector('.videoTotalControls')

let controlsTimeout = null
let controlsMovementTimeout = null
let volumeValue = 0.5
video.volume = volumeValue

const handlePlayClick = (e) => {
  if (video.paused) {
    video.play()
  } else {
    video.pause()
  }
  playBtnIcon.classList = video.paused ? 'fas fa-play' : 'fas fa-pause'
}

const handleMute = (event) => {
  if (video.muted) {
    video.muted = false
  } else {
    video.muted = true
  }
  console.log(video.muted)
  muteBtnIcon.classList = video.muted
    ? 'fa-solid fa-volume-xmark'
    : 'fas fa-volume-up'
  volumeRange.value = video.muted ? 0 : volumeValue
}

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event
  volumeValue = value
  muteBtnIcon.classList =
    volumeValue <= 0 ? 'fa-solid fa-volume-xmark' : 'fas fa-volume-up'
}

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration))
  timeLine.max = Math.floor(video.duration)
}

const formatTime = (seconds) => {
  if (seconds >= 3600) {
    return new Date(seconds * 1000).toISOString().substring(11, 19)
  } else {
    return new Date(seconds * 1000).toISOString().substring(15, 19)
  }
}

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime))
  timeLine.value = Math.floor(video.currentTime)
}
const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event
  video.currentTime = value
}

const handleFullScreen = (event) => {
  const fullscreen = document.fullscreenElement
  if (fullscreen) {
    document.exitFullscreen()
    fullScreenBtnIcon.classList = 'fa-solid fa-expand'
  } else {
    videoContainer.requestFullscreen()
    fullScreenBtnIcon.classList = 'fa-solid fa-minimize'
  }
}
const hideControls = () => {
  videoTotalControls.style.display = 'none'
}

const handleMouseMove = (event) => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout)
    controlsTimeout = null
  }
  // 이게 실행되면 오래된 timeout은 취소되고 새로운 timeout을 만든다.
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout)
    controlsMovementTimeout = null
  }
  // videoControls.classList.add('showing')
  videoTotalControls.style.display = 'block'
  controlsMovementTimeout = setTimeout(hideControls, 3000)
}
// 마우
const handleMouseLeave = (event) => {
  controlsTimeout = setTimeout(hideControls, 2000)
}
const showVolumeBar = (event) => {
  volumeRange.style.display = 'block'
}
const hideVolumeBar = (event) => {
  volumeRange.style.display = 'none'
}
play.addEventListener('click', handlePlayClick)
mute.addEventListener('click', handleMute)
// 볼륨 range에서는 input으로 이벤트 감지
volumeRange.addEventListener('input', handleVolumeChange)
video.addEventListener('loadedmetadata', handleLoadedMetadata)

// 비디오 시간이 변경되는 걸 감지하는 이벤트
video.addEventListener('timeupdate', handleTimeUpdate)
timeLine.addEventListener('input', handleTimelineChange)
fullScreenBtn.addEventListener('click', handleFullScreen)
video.addEventListener('mousemove', handleMouseMove)
video.addEventListener('mouseleave', handleMouseLeave)
volumeArea.addEventListener('mouseenter', showVolumeBar)
volumeArea.addEventListener('mouseleave', hideVolumeBar)
