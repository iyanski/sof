import express from 'express';
import { OffersService } from '../services/offers.service';
const router = express.Router();

router.post('/offers', (req: express.Request, res: express.Response) => {
    const { shipment } = req.body;
    res.json(new OffersService().getOffers({ shipment }));
});

export default router;