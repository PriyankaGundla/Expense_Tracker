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
    // 🔴 Check duplicate title (case-insensitive)
    const existingExpense = await this.expenseRepository
      .createQueryBuilder('expense')
      .where('LOWER(expense.title) = LOWER(:title)', {
        title: createExpenseDto.title.trim(),
      })
      .getOne();

    if (existingExpense) {
      throw new BadRequestException('Expense with this title already exists');
    }

    // 🔹 Date parsing
    const [day, month, year] = createExpenseDto.date.split('-').map(Number);

    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date');
    }

    // 🔹 Create entity
    const expense = this.expenseRepository.create({
      ...createExpenseDto,
      title: createExpenseDto.title.trim(),
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


}
