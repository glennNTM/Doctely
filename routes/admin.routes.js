import { Router } from "express"
import { getAdmins, createAdmin, deleteAdmin } from "../controllers/admin.controller.js"

const adminRouter = Router();

adminRouter.get('/', getAdmins)

adminRouter.post('/', createAdmin)

adminRouter.delete('/:id', deleteAdmin)


export default adminRouter