import { Controller, Post, Body, UseGuards, Get, Param, Put, Delete } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './DTO/create-expense.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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
    console.log('Creating expense with data:', createExpenseDto);
    return this.expensesService.createExpense(createExpenseDto);
  }

  @Get('')
  @ApiOperation({ summary: 'Get all expenses' })
  async getAll() {
    return this.expensesService.getAllExpenses();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get expense by ID' })
  async getById(@Param('id') id: string) {
    return this.expensesService.getExpenseById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update expense by ID' })
  async update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expensesService.updateExpense(id, updateExpenseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete expense by ID' })
  async delete(@Param('id') id: string) {
    return this.expensesService.deleteExpense(id);
  }
}
