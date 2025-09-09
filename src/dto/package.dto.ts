import { IsString, IsNotEmpty, IsNumber, IsObject, ValidateNested, Min, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * @swagger
 * components:
 *   schemas:
 *     PackageDimensions:
 *       type: object
 *       required:
 *         - length
 *         - width
 *         - height
 *       properties:
 *         length:
 *           type: number
 *           minimum: 0.1
 *           description: Length in centimeters
 *           example: 30
 *         width:
 *           type: number
 *           minimum: 0.1
 *           description: Width in centimeters
 *           example: 20
 *         height:
 *           type: number
 *           minimum: 0.1
 *           description: Height in centimeters
 *           example: 15
 */
export class PackageDimensionsDto {
  @IsNumber()
  @Min(0.1)
    length: number;

  @IsNumber()
  @Min(0.1)
    width: number;

  @IsNumber()
  @Min(0.1)
    height: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Package:
 *       type: object
 *       required:
 *         - id
 *         - quantity
 *         - weight
 *         - dimensions
 *       properties:
 *         id:
 *           type: string
 *           description: Unique package identifier
 *           example: pkg_001
 *         quantity:
 *           type: number
 *           minimum: 1
 *           description: Number of items in the package
 *           example: 1
 *         weight:
 *           type: number
 *           minimum: 0.1
 *           description: Weight in kilograms
 *           example: 5.5
 *         dimensions:
 *           $ref: '#/components/schemas/PackageDimensions'
 */
export class PackageDto {
  @IsString()
  @IsNotEmpty()
    id: string;

  @IsNumber()
  @IsPositive()
    quantity: number;

  @IsNumber()
  @Min(0.1)
    weight: number;

  @IsObject()
  @ValidateNested()
  @Type(() => PackageDimensionsDto)
    dimensions: PackageDimensionsDto;
}
