import { Request, Response, Router } from "express";

const router = Router();

// Get all restaurants
router.get("/", (req: Request, res: Response) => {
    res.send([]);
})

// Get all menus
router.get("/menu", (req: Request, res: Response) => {
    res.send([]);
})

// Get one menu
router.get("/menu/:id", (req: Request, res: Response) => {

})

// Update menu
router.post("/menu/:id", (req: Request, res: Response) => {

})


export default router;