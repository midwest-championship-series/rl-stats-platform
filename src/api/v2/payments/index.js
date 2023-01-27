const router = require('express').Router()
const Stripe = require('stripe')

const API_KEY = process.env.STRIPE_API_KEY || ''

const stripe = new Stripe(API_KEY, {
  apiVersion: '2022-08-01',
})

const getPaymentPage = async (email) => {
  const res = await stripe.customers.list({
    email,
  })
  return res.data[0]
}

router.get('/payment-page', async (req, res, next) => {
  try {
    const customer = await getPaymentPage('corbin.fonville@gmail.com')
    if (!customer) {
      res.status(404)
    } else {
      req.context = customer
    }
    next()
  } catch (err) {
    next(err)
  }
})

module.exports = router
