import { IsOptional as IsOpt } from 'class-validator';

import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const IsOptional = () => applyDecorators(IsOpt(), ApiPropertyOptional());
