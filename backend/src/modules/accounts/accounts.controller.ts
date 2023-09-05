import { Account } from 'src/database/entities';
import { Role } from 'src/database/enums/role.enum';

// eslint-disable-next-line prettier/prettier
import {
    Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// eslint-disable-next-line prettier/prettier
import {
    AccountDeleteAdminRoleForbiddenException, AccountForbiddenException, AccountNotFoundException,
    AccountSetAdminRoleForbiddenException
} from '../exceptions/errors';
import { ApiException } from '../shared/decorators';
import { CheckJwt, CheckRoles, GetAccount } from '../shared/decorators/auth';
import { ApiTagName } from '../shared/enums';
import { AccountsService } from './accounts.service';
// eslint-disable-next-line prettier/prettier
import {
    AccountResponseDto, AccountWithBirthdayCountResponseDto, AccountWithDetailsResponseDto,
    UpdateAccountDto, UpdateRoleAndStatusAccountDto
} from './dtos';
import { GetAccountDto } from './dtos/get-accout.dto';

@Controller({ path: 'accounts/', version: '1' })
@CheckJwt()
@ApiTags(ApiTagName.Accounts)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  // TODO: Add sorting and filtering
  // TODO: Add pagination
  /**
   * Get accounts.
   */
  @Get()
  getAccounts(): Promise<AccountResponseDto[]> {
    return this.accountsService.getAccounts();
  }

  /**
   * Get accounts with birthday count.
   */
  @Get('birtday-counts')
  getAccountsWithBirthdayCounts(): Promise<
    AccountWithBirthdayCountResponseDto[]
  > {
    return this.accountsService.getAccountsWithBirthdayCounts();
  }

  /**
   * Get account.
   */
  @Get(':id')
  @ApiException(() => [AccountNotFoundException])
  getAccount(
    @Param() dto: GetAccountDto,
  ): Promise<AccountWithDetailsResponseDto> {
    return this.accountsService.getAccount(dto.id);
  }

  /**
   * Update account. Only updates provided values in body. Provide null to set empty.
   */
  @Post(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiException(() => [AccountNotFoundException, AccountForbiddenException])
  updateAccount(
    @Param() dto: GetAccountDto,
    @Body() body: UpdateAccountDto,
    @GetAccount() currentAccount: Account,
  ): Promise<void> {
    return this.accountsService.updateAccount(dto.id, body, currentAccount);
  }

  /**
   * Update role and status of account. Only BOARD and ADMIN can set. Only AMINs can set ADMINs accounts.
   */
  @Patch(':id/role-and-status')
  @CheckRoles(Role.ADMIN, Role.BOARD)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiException(() => [
    AccountNotFoundException,
    AccountSetAdminRoleForbiddenException,
  ])
  updateAccountRoleAndStatus(
    @Param() dto: GetAccountDto,
    @Body() body: UpdateRoleAndStatusAccountDto,
    @GetAccount() currentAccount: Account,
  ): Promise<void> {
    return this.accountsService.updateAccountRoleAndStatus(
      dto.id,
      body,
      currentAccount,
    );
  }

  /**
   * Delete account. Only BOARD and ADMIN can delete. Only AMINs can delete ADMINs accounts.
   */
  @Delete(':id')
  @CheckRoles(Role.ADMIN, Role.BOARD)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiException(() => [
    AccountNotFoundException,
    AccountDeleteAdminRoleForbiddenException,
  ])
  deleteAccount(
    @Param() dto: GetAccountDto,
    @GetAccount() currentAccount: Account,
  ): Promise<void> {
    return this.accountsService.deleteAccount(dto.id, currentAccount);
  }
}
