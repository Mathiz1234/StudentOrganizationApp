import { Account } from 'src/database/entities';
import { Role } from 'src/database/enums/role.enum';

import {
    Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
    DeadlineFrobiddenException, DeadlineNotFoundException, ProjectNotFoundException
} from '../exceptions/errors';
import { ApiException, CheckJwt, CheckRoles, GetAccount } from '../shared/decorators';
import { ApiTagName } from '../shared/enums';
import { DeadlinesService } from './deadlines.service';
import { DeadlineDto, GetDeadlineDto, GetDeadlineResponseDto, GetDeadlinesDto } from './dtos';

@Controller({ path: 'deadlines/', version: '1' })
@CheckJwt()
@ApiTags(ApiTagName.Deadlines)
export class DeadlinesController {
  constructor(private readonly deadlinesService: DeadlinesService) {}

  /**
   * Get deadlines.
   */
  @Get()
  @ApiException(() => [ProjectNotFoundException])
  getDeadlines(
    @Query() query: GetDeadlinesDto,
  ): Promise<GetDeadlineResponseDto[]> {
    return this.deadlinesService.getDeadlines(query);
  }

  /**
   * Add deadline. For everyone.
   */
  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiException(() => [ProjectNotFoundException])
  addDeadline(
    @Body() body: DeadlineDto,
    @GetAccount() currentAccount: Account,
  ): Promise<void> {
    return this.deadlinesService.addDeadline(body, currentAccount);
  }

  /**
   * Update deadline. Only can update your deadline or if you are ADMIN.
   */
  @Post(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiException(() => [
    ProjectNotFoundException,
    DeadlineNotFoundException,
    DeadlineFrobiddenException,
  ])
  updateProject(
    @Param() dto: GetDeadlineDto,
    @Body() body: DeadlineDto,
    @GetAccount() currentAccount: Account,
  ): Promise<void> {
    return this.deadlinesService.updateDeadline(dto.id, body, currentAccount);
  }

  /**
   * Delete deaedline. Only can delete your deadline or if you are ADMIN.
   */
  @Delete(':id')
  @CheckRoles(Role.ADMIN, Role.BOARD)
  @ApiException(() => [DeadlineNotFoundException, DeadlineFrobiddenException])
  deleteProject(
    @Param() dto: GetDeadlineDto,
    @GetAccount() currentAccount: Account,
  ): Promise<string> {
    return this.deadlinesService.deleteDeadline(dto.id, currentAccount);
  }
}
