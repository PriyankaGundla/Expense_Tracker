import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../../entities/expense.entity';
import { CreateExpenseDto } from './DTO/create-expense.dto';
import { UpdateExpenseDto } from './DTO/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
  ) { }

  async createExpense(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    const title = createExpenseDto.title.trim();

    // 🔹 Parse date (dd-mm-yyyy)
    const [day, month, year] = createExpenseDto.date.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    // 🔹 Check duplicate (same title + same date)
    const existingExpense = await this.expenseRepository
      .createQueryBuilder('expense')
      .where('LOWER(expense.title) = LOWER(:title)', { title })
      .andWhere('expense.date = :date', { date })
      .getOne();

    if (existingExpense) {
      throw new BadRequestException(
        'Expense with the same title already exists for this date',
      );
    }

    const expense = this.expenseRepository.create({
      ...createExpenseDto,
      title,
      date,
    });

    return this.expenseRepository.save(expense);
  }


  private formatDate(date: Date | string): string {
    const d = new Date(date);
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }


  async getAllExpenses(): Promise<any[]> {
    const expenses = await this.expenseRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });


    return expenses.map(exp => ({
      id: exp.id,
      title: exp.title,
      category: exp.category,
      amount: exp.amount,
      date: this.formatDate(exp.date),
    }));
  }



  async getExpenseById(id: string): Promise<any> {
    const expense = await this.expenseRepository.findOne({ where: { id } });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return {
      id: expense.id,
      title: expense.title,
      category: expense.category,
      amount: expense.amount,
      date: this.formatDate(expense.date), // return in dd-mm-yyyy
    };
  }

  async updateExpense(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<any> {
    const expense = await this.expenseRepository.findOne({ where: { id } });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    // Handle date separately
    if (updateExpenseDto.date) {
      const [day, month, year] = updateExpenseDto.date.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);

      if (isNaN(dateObj.getTime())) {
        throw new BadRequestException('Invalid date');
      }

      expense.date = dateObj;
    }

    Object.assign(expense, {
      title: updateExpenseDto.title ?? expense.title,
      category: updateExpenseDto.category ?? expense.category,
      amount: updateExpenseDto.amount ?? expense.amount,
    });

    const saved = await this.expenseRepository.save(expense);

    return {
      id: saved.id,
      title: saved.title,
      category: saved.category,
      amount: saved.amount,
      date: this.formatDate(saved.date),
    };
  }

  async deleteExpense(id: string): Promise<{ message: string }> {
    const expense = await this.expenseRepository.findOne({ where: { id } });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    await this.expenseRepository.remove(expense);

    return {
      message: 'Expense deleted successfully',
    };
  }

  async getCurrentMonthTotalExpense() {
    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth(); // 0-based

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 1);

    const result = await this.expenseRepository
      .createQueryBuilder('expense')
      .select('COALESCE(SUM(expense.amount), 0)', 'total')
      .where('expense.date >= :startDate', { startDate })
      .andWhere('expense.date < :endDate', { endDate })
      .getRawOne();

    return {
      year,
      month: month + 1, // convert to 1-based for response
      totalExpense: Number(result.total),
    };
  }



}
