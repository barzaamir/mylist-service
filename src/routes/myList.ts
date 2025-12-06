import { Router } from 'express'
import myListController from '../controllers/myListController'
import myListValidator from '../validators/myListValidator'
const router = Router()

const { add, remove, list } = myListController
const { validateAdd, validateList, validateRemove } = myListValidator

router.post('/', validateAdd, add)
router.delete('/:contentId', validateRemove, remove)
router.get('/', validateList, list)

export default router
