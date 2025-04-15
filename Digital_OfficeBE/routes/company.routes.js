import { Router } from "express";
import registerCompany from "../controllers/company.controller.js";
const router = Router()

router.route('/register').post(registerCompany)



export default router;