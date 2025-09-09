import { IsObject, ValidateNested, IsArray, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';
import { PackageDto } from './package.dto';

/**
 * @swagger
 * components:
 *   schemas:
 *     Shipment:
 *       type: object
 *       required:
 *         - originAddress
 *         - destinationAddress
 *         - packages
 *       properties:
 *         originAddress:
 *           $ref: '#/components/schemas/Address'
 *         destinationAddress:
 *           $ref: '#/components/schemas/Address'
 *         packages:
 *           type: array
 *           minItems: 1
 *           items:
 *             $ref: '#/components/schemas/Package'
 *           description: Array of packages in the shipment
 */
export class ShipmentDto {
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
    originAddress: AddressDto;

  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
    destinationAddress: AddressDto;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PackageDto)
    packages: PackageDto[];
}
