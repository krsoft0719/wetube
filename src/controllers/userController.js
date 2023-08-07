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
  res.render('login', { pageTitle: 'Log in' })

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

    const [existingUser] = await svc.findExistEmail(emailObj.email)
    if (existingUser) {
      req.session.loggedIn = true
      req.session.user = existingUser
      return res.redirect('/')
    } else {
      //create an account
      // 해당 이메일 없으니 계정 생성해줘야함
      const newUser = {
        we_name: userData.name,
        we_username: userData.login,
        we_email: emailObj.email,
        we_password: '',
        we_avatar_url: userData.avatar_url,
        we_scoialOnly: true,
        we_location: userData.location,
      }
      await svc.join(newUser)
      req.session.loggedIn = true
      req.session.user = newUser

      return res.redirect('/')
    }
  }
}

export const edit = (req, res) => res.send('Edit User')
export const remove = (req, res) => res.send('Remove User')
export const logout = (req, res) => {
  req.session = null // 세션 삭제
  res.clearCookie('connect.sid')
  return res.redirect('/')
}
export const see = (req, res) => res.send('See User')
export const getJoin = (req, res) => res.render('Join', { pageTitle: 'Join' })
