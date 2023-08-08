import fetch from 'node-fetch'
import bcrypt from 'bcrypt'
let svc = require('../service/user')
import 'dotenv/config'

//회원가입
export const postJoin = async (req, res) => {
  const pageTitle = 'Join'
  const userData = req.body
  const { name, email, username, password, passwordCheck, location } = req.body
  if (password !== passwordCheck) {
    return res.render('join', {
      pageTitle,
      errorMessage: 'Password confirmation does not match',
    })
  }
  const existUser = await svc.findExistsUser(username, email)
  if (existUser.length > 0) {
    return res.render('join', {
      pageTitle: 'Join',
      errorMessage: 'This username/email is already taken',
    })
  }
  try {
    await svc.join(userData)
  } catch (error) {
    return res.render('join', {
      pageTitle: 'Join',
      errorMessage: error._message,
    })
  }
  return res.redirect('/login')
}

//로그인페이지
export const getLogin = (req, res) =>
  res.render('users/login', { pageTitle: 'Log in' })

export const postLogin = async (req, res) => {
  const { username, password } = req.body
  let socialOnly = false

  const [user] = await svc.login(username)
  const pageTitle = 'Login'
  if (!user) {
    return res.status(400).render('login', {
      pageTitle,
      errorMessage: 'An account with this username does not exists',
    })
  }

  const ok = await bcrypt.compare(password, user.we_password)
  if (!ok) {
    return res.status(400).render('login', {
      pageTitle,
      errorMessage: 'Wrong password',
    })
  }
  // 세션 초기화 하는 부분
  // 세션을 수정할 때만 db에 저장해줌
  req.session.loggedIn = true
  console.log('그냥 로그인 유저 ', user)
  req.session.user = user

  return res.redirect('/')
}
// 소셜로그인 시작
export const startGithubLogin = (req, res) => {
  const baseUrl = 'https://github.com/login/oauth/authorize'
  const config = {
    client_id: process.env.GH_CLIENT_ID,
    allow_signup: false,
    scope: 'read:user user:email',
  }
  const params = new URLSearchParams(config).toString()

  const finalUrl = `${baseUrl}?${params}`
  return res.redirect(finalUrl)
}
// 소셜 로그인 끝
export const finishGithubLogin = async (req, res) => {
  const baseUrl = 'https://github.com/login/oauth/access_token'

  const config = {
    client_id: process.env.GH_CLIENT_ID,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  }
  const params = new URLSearchParams(config).toString()
  const finalUrl = `${baseUrl}?${params}`
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    })
  ).json()

  if ('access_token' in tokenRequest) {
    const { access_token } = tokenRequest
    const apiUrl = 'https://api.github.com'
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json()
    console.log('userData: ', userData)
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json()
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true,
    )
    if (!emailObj) return res.redirect('/login')

    const [existingUser] = await svc.findExistScoial(emailObj.email)
    if (existingUser) {
      // 계정 있을 때
      req.session.loggedIn = true
      req.session.user = existingUser
      return res.redirect('/')
    } else {
      // 계정 없을 때 바로 회원가입 후 로그인
      const newUser = {
        we_name: userData.name,
        we_username: userData.login,
        we_email: emailObj.email,
        we_password: '',
        we_avatar_url: userData.avatar_url,
        we_location: userData.location,
        we_social: true,
      }
      await svc.join_social(newUser)
      req.session.loggedIn = true
      req.session.user = newUser

      return res.redirect('/')
    }
  }
}
// 프로필 수정 페이지 조회
export const getEdit = (req, res) => {
  return res.render('users/edit-profile', {
    pageTitle: 'Edit Profile',
    user: req.session.user,
  })
}
// 프로필 수정
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { we_email, we_username, user_pk },
    },
    body: { name, email, username, location },
  } = req
  await svc.updateProfile(user_pk, name, email, username, location)
  req.session.user = {
    ...req.session.user,
    name,
    email,
    username,
    location,
  }
  return res.redirect('/users/edit-profile')
}

export const remove = (req, res) => res.send('Remove User')
export const logout = (req, res) => {
  req.session = null // 세션 삭제
  res.clearCookie('connect.sid')
  return res.redirect('/')
}

export const getChangePassword = (req, res) => {
  if (req.session.user.we_social === true) {
    return res.redirect('/')
  }
  return res.render('users/change-password', { pageTitle: 'Change Passwword' })
}
export const postgetChangePassword = async (req, res) => {
  // send notification
  const {
    session: {
      user: { user_pk, we_password },
    },
    body: { oldpw, newpw, pwconfirm },
  } = req
  // 기존 비번과 일치 확인
  const ok = await bcrypt.compare(oldpw, we_password)
  if (!ok) {
    return res.status(400).render('users/change-password', {
      pageTitle: 'Change Password',
      errorMessage: 'The current password is incorrect',
    })
  }
  // 비밀번호 체크 일치 확인
  if (pwconfirm !== newpw) {
    return res.status(400).render('users/change-password', {
      pageTitle: 'Change Passwword',
      errorMessage: 'The password confirm does not match',
    })
  }

  // 비밀번호 바꿈
  await svc.updatePassword(user_pk, newpw)
  console.log('!!! ', req.session.user.we_password)
  req.session.user.we_password = newpw
  return res.redirect('/users/logout')
}

export const see = (req, res) => res.send('See User')
export const getJoin = (req, res) => res.render('Join', { pageTitle: 'Join' })
