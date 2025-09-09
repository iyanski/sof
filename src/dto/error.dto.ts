import { IsString, IsArray, IsOptional } from 'class-validator';

/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error type
 *           example: ValidationError
 *         message:
 *           type: string
 *           description: Error message
 *           example: Invalid shipment data provided
 *         details:
 *           type: array
 *           items:
 *             type: string
 *           description: Detailed error information
 *           example: ["packages array cannot be empty", "weight must be a positive number"]
 */
export class ErrorDto {
  @IsString()
    error: string;

  @IsString()
    message: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
    details?: string[];
}
