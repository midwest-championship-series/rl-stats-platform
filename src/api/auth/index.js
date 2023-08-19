const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const { Auth } = require('../../model/mongodb')

const JWT_KEY = process.env.JWT_KEY

async function hashPassword(password) {
  const saltRounds = 10 // Number of salt rounds for bcrypt
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  return hashedPassword
}

async function comparePasswords(incomingPassword, savedHashedPassword) {
  try {
    const passwordsMatch = await bcrypt.compare(incomingPassword, savedHashedPassword)
    return passwordsMatch
  } catch (error) {
    console.error('Error comparing passwords:', error)
    throw error
  }
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const [match] = await Auth.find({ email }).populate('player')
    if (!match) {
      return res.status(401).send({ message: 'No user with that email' })
    }

    const pwMatch = await comparePasswords(password, match.password)

    const signedObject = { auth_id: match._id }
    if (match.player) {
      signedObject.player_id = match.player._id
    }

    if (pwMatch) {
      const token = jwt.sign(signedObject, JWT_KEY, { expiresIn: '1h' }) // Customize the expiration as needed
      return res.status(200).send({ token, player: match.player, auth: { email: match.email } })
    } else {
      res.status(401).send({ message: 'Invalid credentials' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: 'Internal server error' })
  }
})

router.post('/account', async (req, res, next) => {
  try {
    const { key } = req.query
    if (key !== 'jfkdsaoljfkdlsajfkdsal') {
      return res.status(401).send()
    }

    const { email, password } = req.body
    console.log({ email, password })
    const [match] = await Auth.find({ email })
    if (match) {
      return res.status(400).send({ message: 'User already exists' })
    }

    const auth = new Auth({
      email,
      password: await hashPassword(password),
    })
    await auth.save()
    return res.status(201).send()
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: 'internal server error' })
  }
})

router.post('/verify', async (req, res, next) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).send({ message: 'Token is missing' })
    }

    try {
      const decoded = jwt.verify(token, JWT_KEY)
      res.status(200).send({ message: 'Token is valid', decoded })
    } catch (error) {
      console.error(error)
      res.status(401).send({ message: 'Token is invalid' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: 'Internal server error' })
  }
})

module.exports = router
