import { Router } from "express"
import { getAdmins, createAdmin, deleteAdmin } from "../controllers/admin.controller.js"
import { adminOnly, authenticate } from "../middlewares/auth.middleware.js";

const adminRouter = Router();

adminRouter.get('/', authenticate, adminOnly, getAdmins)

adminRouter.post('/', authenticate, adminOnly, createAdmin)

adminRouter.delete('/:id', authenticate, adminOnly , deleteAdmin)


export default adminRouter