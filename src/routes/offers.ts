import express from 'express';
const router = express.Router();

router.post('/offers', (req: express.Request, res: express.Response) => {
    const { shipment } = req.body;
    res.json(shipment);
});

export default router;