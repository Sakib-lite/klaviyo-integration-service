import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import {
  ProfileAttributesResponseDto,
  ProfileMetricsResponseDto,
} from './dto/profile-response.dto';
import { PrivateBaseController } from '../../@core/etcs/base-controllers/private.base.controller';

@ApiTags('Profiles')
@Controller('private/profiles')
export class ProfileController extends PrivateBaseController {
  constructor(private readonly profileService: ProfileService) {
    super();
  }

  @Get(':email/attributes')
  @ApiOperation({
    summary: 'Get profile attributes by email',
    description:
      'Retrieves profile attributes from Klaviyo for a given email address',
  })
  @ApiParam({
    name: 'email',
    description: 'Email address of the profile',
    example: 'customer@example.com',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile attributes retrieved successfully',
    type: ProfileAttributesResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getProfileAttributes(
    @Param('email') email: string,
  ): Promise<ProfileAttributesResponseDto> {
    return this.profileService.getProfileAttributes(email);
  }

  @Get(':email/metrics')
  @ApiOperation({
    summary: 'Get all events/metrics for a profile',
    description:
      'Retrieves all events associated with a profile from Klaviyo by email address',
  })
  @ApiParam({
    name: 'email',
    description: 'Email address of the profile',
    example: 'customer@example.com',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile metrics retrieved successfully',
    type: ProfileMetricsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getProfileMetrics(
    @Param('email') email: string,
  ): Promise<ProfileMetricsResponseDto> {
    return this.profileService.getProfileMetrics(email);
  }
}
