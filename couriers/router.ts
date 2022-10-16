import { Request, Response, Router } from "express";

const router = Router();

// Get order notification (socket)

// Get all couriers
router.get("/", (req: Request, res: Response) => {
    res.send([]);
})

// Get couriers in a specific area
router.get("/area/:area", (req: Request, res: Response) => {
    res.send([]);
})


export default router;