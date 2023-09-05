import { query } from 'express';
import { Account } from 'src/database/entities';
import { Role } from 'src/database/enums/role.enum';

import {
    Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
    ProjectAlreadyExistsException, ProjectCannotDeleteWithFunciontsException,
    ProjectNotFoundException
} from '../exceptions/errors';
import { ApiException, CheckJwt, CheckRoles, GetAccount } from '../shared/decorators';
import { ApiTagName } from '../shared/enums';
import {
    GetProjectCTDto, GetProjectCTResponseDto, GetProjectDetailsResponseDto, GetProjectDto,
    ProjectDto
} from './dtos';
import { ProjectsService } from './projects.service';

@Controller({ path: 'projects/', version: '1' })
@CheckJwt()
@ApiTags(ApiTagName.Projects)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * Get projects.
   */
  @Get()
  getProjects(): Promise<GetProjectDetailsResponseDto[]> {
    return this.projectsService.getProjects();
  }

  /**
   * Get project CT.
   */
  @Get(':id/core-team')
  getProjectCT(
    @Param() dto: GetProjectDto,
    @Query() query: GetProjectCTDto,
  ): Promise<GetProjectCTResponseDto[]> {
    return this.projectsService.getProjectCT(dto, query);
  }

  /**
   * Add project. Only for ADMINs and BOARDs.
   */
  @Post()
  @CheckRoles(Role.ADMIN, Role.BOARD)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiException(() => [ProjectAlreadyExistsException])
  addProject(
    @Body() body: ProjectDto,
    @GetAccount() currentAccount: Account,
  ): Promise<void> {
    return this.projectsService.addProject(body, currentAccount);
  }

  /**
   * Update project. Only for ADMINs and BOARDs.
   */
  @Post(':id')
  @CheckRoles(Role.ADMIN, Role.BOARD)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiException(() => [ProjectAlreadyExistsException, ProjectNotFoundException])
  updateProject(
    @Param() dto: GetProjectDto,
    @Body() body: ProjectDto,
    @GetAccount() currentAccount: Account,
  ): Promise<void> {
    return this.projectsService.updateProject(dto.id, body, currentAccount);
  }

  /**
   * Delete project. Only for ADMINs and BOARDs.
   */
  @Delete(':id')
  @CheckRoles(Role.ADMIN, Role.BOARD)
  @ApiException(() => [
    ProjectNotFoundException,
    ProjectCannotDeleteWithFunciontsException,
  ])
  deleteProject(@Param() dto: GetProjectDto): Promise<string> {
    return this.projectsService.deleteProject(dto.id);
  }
}
