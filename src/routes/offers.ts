import express from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { OffersService } from '../services/offers.service';
import { EligibilityService } from '../services/eligibility.service';
import { OfferRequestDto } from '../dto';
import { asyncHandler, AppValidationError } from '../middleware/error.middleware';

const router = express.Router();

router.post('/offers', asyncHandler(async (req: express.Request, res: express.Response) => {
  // Transform and validate the request body using DTOs
  const offerRequest = plainToInstance(OfferRequestDto, req.body);
  const validationErrors = await validate(offerRequest);

  if (validationErrors.length > 0) {
    const errorDetails = validationErrors.map(error =>
      Object.values(error.constraints || {}).join(', ')
    );

    // Throw validation error - will be caught by global error handler
    throw new AppValidationError('Invalid shipment data provided', errorDetails);
  }

  const eligibilityService = new EligibilityService();
  const offersService = new OffersService(eligibilityService);
  const result = await offersService.getOffers({ shipment: offerRequest.shipment });

  res.json(result);
}));

export default router;