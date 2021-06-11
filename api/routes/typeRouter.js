const Router = require('express')
const typeController = require('../controllers/typeController')
const router = new Router()
const checkRole = require('../middleware/checkRoleMiddleware');

router.get('/', typeController.getAll)
router.post('/', checkRole('ADMIN'), typeController.create)



module.exports = router