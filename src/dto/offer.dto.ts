import { IsString, IsNumber, IsBoolean, IsArray, Min, Max, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ShipmentDto } from './shipment.dto';

/**
 * @swagger
 * components:
 *   schemas:
 *     Offer:
 *       type: object
 *       properties:
 *         carrierId:
 *           type: string
 *           description: Unique carrier identifier
 *           example: dhl-001
 *         carrierName:
 *           type: string
 *           description: Human-readable carrier name
 *           example: DHL
 *         cost:
 *           type: number
 *           description: Total cost in SEK
 *           example: 55.00
 *         deliveryTime:
 *           type: number
 *           description: Estimated delivery time in days
 *           example: 3
 *         eligibilityScore:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: Overall eligibility score (0-100)
 *           example: 85
 *         costEfficiencyScore:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: Cost efficiency score (0-100)
 *           example: 95
 *         serviceQualityScore:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: Service quality score (0-100)
 *           example: 78
 *         reasons:
 *           type: array
 *           items:
 *             type: string
 *           description: Explanatory reasons for the offer
 *           example: ["competitive pricing: 10 SEK/kg", "good delivery speed: 3 days"]
 *         isEligible:
 *           type: boolean
 *           description: Whether the carrier meets eligibility requirements
 *           example: true
 */
export class OfferDto {
  @IsString()
    carrierId: string;

  @IsString()
    carrierName: string;

  @IsNumber()
    cost: number;

  @IsNumber()
    deliveryTime: number;

  @IsNumber()
  @Min(0)
  @Max(100)
    eligibilityScore: number;

  @IsNumber()
  @Min(0)
  @Max(100)
    costEfficiencyScore: number;

  @IsNumber()
  @Min(0)
  @Max(100)
    serviceQualityScore: number;

  @IsArray()
  @IsString({ each: true })
    reasons: string[];

  @IsBoolean()
    isEligible: boolean;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     OfferRequest:
 *       type: object
 *       required:
 *         - shipment
 *       properties:
 *         shipment:
 *           $ref: '#/components/schemas/Shipment'
 */
export class OfferRequestDto {
  @IsObject()
  @ValidateNested()
  @Type(() => ShipmentDto)
    shipment: ShipmentDto;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     OfferResponse:
 *       type: object
 *       properties:
 *         offers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Offer'
 *           description: Array of available offers
 *         generatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when offers were generated
 *           example: "2024-01-15T10:30:00Z"
 */
export class OfferResponseDto {
  offers: OfferDto[];
  generatedAt: Date;
}
