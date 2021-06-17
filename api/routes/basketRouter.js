const Router = require('express')
const router = new Router()
const basketController = require('../controllers/basketController');

router.get('/', basketController.getAll)
router.get('/:email', basketController.getOne)
router.post('/', basketController.create)
router.put('/', basketController.update)
router.delete('/:id', basketController.delete)



module.exports = router