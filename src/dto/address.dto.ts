import { IsString, IsNotEmpty, Length } from 'class-validator';

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       required:
 *         - country
 *       properties:
 *         country:
 *           type: string
 *           description: Country code (e.g., SE, NO, DK)
 *           example: SE
 *           minLength: 2
 *           maxLength: 2
 */
export class AddressDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
    country: string;
}
