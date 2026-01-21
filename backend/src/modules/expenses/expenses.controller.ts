import { Controller, Post, Body, UseGuards, Get, Param, Put, Delete, Query, ParseUUIDPipe, BadRequestException } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './DTO/create-expense.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateExpenseDto } from './DTO/update-expense.dto';

@ApiTags('Expenses')
@ApiBearerAuth('JWT')
@Controller('api/expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) { }

  @Post('/create-expense')
  @ApiOperation({ summary: 'create expense' })
  async createExpense(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.createExpense(createExpenseDto);
  }

  @Get('')
  @ApiOperation({ summary: 'Get all expenses' })
  async getAll() {
    return this.expensesService.getAllExpenses();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search expenses by year and/or month' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'month', required: false, type: Number })
  @ApiQuery({ name: 'searchText', required: false, type: String })
  async searchExpenses(
    @Query('year') year?: number,
    @Query('month') month?: number,
    @Query('searchText') searchText?: string,
  ) {

    if (year && !/^\d{4}$/.test(year.toString())) {
      throw new BadRequestException('Year must be a 4-digit number');
    }

    if (month && (month < 1 || month > 12)) {
      throw new BadRequestException('Month must be between 1 and 12');
    }

    return this.expensesService.searchExpenses(
      year ? Number(year) : undefined,
      month ? Number(month) : undefined,
      searchText?.toString(),
    );
  }

  @Get('total-expense/current-month')
  @ApiOperation({ summary: 'Get total expense for a current month' })
  getCurrentMonthTotal() {
    return this.expensesService.getCurrentMonthTotalExpense();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get expense by ID' })
  async getExpenseById(
    @Param('id', new ParseUUIDPipe({
      version: '4',
      exceptionFactory: () => new BadRequestException('Invalid UUID'), 
    }),) id: string,
  ) {
    return this.expensesService.getExpenseById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update expense by ID' })
  async updateExpense(
    @Param('id', new ParseUUIDPipe({
      version: '4',
      exceptionFactory: () => new BadRequestException('Invalid UUID'), 
    }),) id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expensesService.updateExpense(id, updateExpenseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete expense by ID' })
  async deleteExpense(@Param('id', new ParseUUIDPipe({
      version: '4',
      exceptionFactory: () => new BadRequestException('Invalid UUID'), 
    }),) id: string) {
    return this.expensesService.deleteExpense(id);
  }





}
