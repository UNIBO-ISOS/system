import { Request, Response } from 'express';

const getFoo = async (req: Request, res: Response, next: any) => {
    res.status(200).json({ text: 'success!!!' })
}

export { getFoo }