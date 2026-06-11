import { Router } from "express";
import { syncUser} from "../controllers/userController";
import { requireAuth } from "@clerk/express";

const router = Router();

// POST /api/users/sync => Sync the Clerk user to DB (protected)
router.post("/sync",requireAuth(), syncUser);

export default router;