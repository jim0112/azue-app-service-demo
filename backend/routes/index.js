import { Router } from "express";
import execRouter from "./exec"
const router = Router();
router.use('/', execRouter);
export default router;