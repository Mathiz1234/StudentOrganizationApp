import { Account } from 'src/database/entities';
import { Role } from 'src/database/enums/role.enum';

import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AccountNotFoundException, ProjectNotFoundException } from '../exceptions/errors';
import {
    AccountFunctionNotFoundException, FunctionAlreadyExistsException,
    FunctionAssignToAccountNotFoundException, FunctionCannotDeleteWithAccountException,
    FunctionNotFoundException
} from '../exceptions/errors/functions.errors';
import { ApiException, CheckJwt, CheckRoles, GetAccount } from '../shared/decorators';
import { ApiTagName } from '../shared/enums';
import {
    AssignFunctionDto, FunctionDto, GetFunctionDto, GetFunctionResponseDto, UnassignFunctionDto
} from './dto';
import { OrganizationFunctionsService } from './organization-functions.service';

@Controller({ path: 'functions/', version: '1' })
@CheckJwt()
@ApiTags(ApiTagName.Functions)
export class OrganizationFunctionsontroller {
  constructor(private readonly functionService: OrganizationFunctionsService) {}
  /**
   * Get functions.
   */
  @Get()
  getFunctions(): Promise<GetFunctionResponseDto[]> {
    return this.functionService.getFunctions();
  }

  /**
   * Add funciotn. Only for ADMINs and BOARDs.
   */
  @Post()
  @CheckRoles(Role.ADMIN, Role.BOARD)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiException(() => [
    FunctionAlreadyExistsException,
    ProjectNotFoundException,
  ])
  addFunction(
    @Body() body: FunctionDto,
    @GetAccount() currentAccount: Account,
  ): Promise<void> {
    return this.functionService.addFunction(body, currentAccount);
  }

  /**
   * Assign function to user. Only for ADMINs and BOARDs.
   */
  @Post('assign-to-account')
  @CheckRoles(Role.ADMIN, Role.BOARD)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiException(() => [AccountNotFoundException, FunctionNotFoundException])
  assignToAccount(
    @Body() body: AssignFunctionDto,
    @GetAccount() currentAccount: Account,
  ): Promise<void> {
    return this.functionService.assignToAccount(body, currentAccount);
  }

  /**
   * Unassign accountFunction to user. Provide not function id but accountFunctionId(Object with year assign to user). Only for ADMINs and BOARDs.
   */
  @Post('unassign-from-account')
  @CheckRoles(Role.ADMIN, Role.BOARD)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiException(() => [
    AccountNotFoundException,
    AccountFunctionNotFoundException,
    FunctionAssignToAccountNotFoundException,
  ])
  unassignFromAccount(@Body() body: UnassignFunctionDto): Promise<void> {
    return this.functionService.unassignFromAccount(body);
  }

  /**
   * Update function. Only for ADMINs and BOARDs.
   */
  @Post(':id')
  @CheckRoles(Role.ADMIN, Role.BOARD)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiException(() => [
    FunctionAlreadyExistsException,
    FunctionNotFoundException,
    ProjectNotFoundException,
  ])
  updateProject(
    @Param() dto: GetFunctionDto,
    @Body() body: FunctionDto,
    @GetAccount() currentAccount: Account,
  ): Promise<void> {
    return this.functionService.updateFunction(dto.id, body, currentAccount);
  }

  /**
   * Delete project. Only for ADMINs and BOARDs.
   */
  @Delete(':id')
  @CheckRoles(Role.ADMIN, Role.BOARD)
  @ApiException(() => [
    FunctionNotFoundException,
    FunctionCannotDeleteWithAccountException,
  ])
  deleteProject(@Param() dto: GetFunctionDto): Promise<string> {
    return this.functionService.deleteFunction(dto.id);
  }
}
