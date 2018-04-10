const router = express.Router()

// GET - Read all messages
router.get('/checkServer', async (req, res) => {
  try {
    res.json({
      message: 'Server is working correctly'
    })
  }
  catch (error) {
    res.status(400).json({ error: error.message })
  }
})

module.exports = router