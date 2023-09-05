import { Account } from 'src/database/entities';
import { Role } from 'src/database/enums/role.enum';

import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AccountNotFoundException } from '../exceptions/errors';
import {
    TrainingAlreadyExistsException, TrainingAssignToAccountNotFoundException,
    TrainingCannotDeleteWithAccountxception, TrainingNotFoundException
} from '../exceptions/errors/trainings.errors';
import { ApiException, CheckJwt, CheckRoles, GetAccount } from '../shared/decorators';
import { ApiTagName } from '../shared/enums';
import {
    AssignTrainingDto, GetTrainingDto, GetTrainingResponseDto, TrainingDto, UnassignTrainingDto
} from './dtos';
import { TrainingsService } from './trainings.service';

@Controller({ path: 'trainings/', version: '1' })
@CheckJwt()
@ApiTags(ApiTagName.Trainings)
export class TrainingsController {
  constructor(private readonly trainingsService: TrainingsService) {}

  /**
   * Get trainings.
   */
  @Get()
  getTrainings(): Promise<GetTrainingResponseDto[]> {
    return this.trainingsService.getTrainings();
  }

  /**
   * Add training. Only for ADMINs and BOARDs.
   */
  @Post()
  @CheckRoles(Role.ADMIN, Role.BOARD)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiException(() => [TrainingAlreadyExistsException])
  addgetTraining(
    @Body() body: TrainingDto,
    @GetAccount() currentAccount: Account,
  ): Promise<void> {
    return this.trainingsService.addTraining(body, currentAccount);
  }

  /**
   * Assign training to user. Only for ADMINs and BOARDs.
   */
  @Post('assign-to-account')
  @CheckRoles(Role.ADMIN, Role.BOARD)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiException(() => [AccountNotFoundException, TrainingNotFoundException])
  assignToAccount(@Body() body: AssignTrainingDto): Promise<void> {
    return this.trainingsService.assignToAccount(body);
  }

  /**
   * Unassign training to user. Only for ADMINs and BOARDs.
   */
  @Post('unassign-from-account')
  @CheckRoles(Role.ADMIN, Role.BOARD)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiException(() => [
    AccountNotFoundException,
    TrainingNotFoundException,
    TrainingAssignToAccountNotFoundException,
  ])
  unassignFromAccount(@Body() body: UnassignTrainingDto): Promise<void> {
    return this.trainingsService.unassignFromAccount(body);
  }

  /**
   * Update training. Only for ADMINs and BOARDs.
   */
  @Post(':id')
  @CheckRoles(Role.ADMIN, Role.BOARD)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiException(() => [
    TrainingAlreadyExistsException,
    TrainingNotFoundException,
  ])
  updateTraining(
    @Param() dto: GetTrainingDto,
    @Body() body: TrainingDto,
    @GetAccount() currentAccount: Account,
  ): Promise<void> {
    return this.trainingsService.updateTraining(dto.id, body, currentAccount);
  }

  /**
   * Delete training. Only for ADMINs and BOARDs.
   */
  @Delete(':id')
  @CheckRoles(Role.ADMIN, Role.BOARD)
  @ApiException(() => [
    TrainingNotFoundException,
    TrainingCannotDeleteWithAccountxception,
  ])
  deleteTraining(@Param() dto: GetTrainingDto): Promise<string> {
    return this.trainingsService.deleteTraining(dto.id);
  }
}
