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

  async createExpense(createExpenseDto: CreateExpenseDto): Promise<{ message: string; data: any }> {
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

    const saved = await this.expenseRepository.save(expense);

    return {
      message: 'Expense created successfully',
      data: {
        id: saved.id,
        title: saved.title,
        category: saved.category,
        amount: saved.amount,
        date: this.formatDate(saved.date),
      },
    };
  }


  private formatDate(date: Date | string): string {
    const d = new Date(date);
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }


  async getAllExpenses(): Promise<{ message: string; data: any[] }> {
    const expenses = await this.expenseRepository.find({
      order: { createdAt: 'DESC' },
    });

    return {
      message: 'Expenses fetched successfully',
      data: expenses.map(exp => ({
        id: exp.id,
        title: exp.title,
        category: exp.category,
        amount: exp.amount,
        date: this.formatDate(exp.date),
      })),
    };
  }

  async getExpenseById(id: string): Promise<{ message: string; data: any }> {
    const expense = await this.expenseRepository.findOne({ where: { id } });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return {
      message: 'Expense fetched successfully',
      data: {
        id: expense.id,
        title: expense.title,
        category: expense.category,
        amount: expense.amount,
        date: this.formatDate(expense.date),
      },
    };
  }

  async updateExpense(id: string, updateExpenseDto: UpdateExpenseDto): Promise<{ message: string; data: any }> {
    const expense = await this.expenseRepository.findOne({ where: { id } });
    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    if (updateExpenseDto.date) {
      const [day, month, year] = updateExpenseDto.date.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);
      if (isNaN(dateObj.getTime())) throw new BadRequestException('Invalid date');
      expense.date = dateObj;
    }

    Object.assign(expense, {
      title: updateExpenseDto.title ?? expense.title,
      category: updateExpenseDto.category ?? expense.category,
      amount: updateExpenseDto.amount ?? expense.amount,
    });

    const saved = await this.expenseRepository.save(expense);

    return {
      message: 'Expense updated successfully',
      data: {
        id: saved.id,
        title: saved.title,
        category: saved.category,
        amount: saved.amount,
        date: this.formatDate(saved.date),
      },
    };
  }

  async deleteExpense(id: string): Promise<{ message: string; data: any[] }> {
    const expense = await this.expenseRepository.findOne({ where: { id } });
    if (!expense) throw new NotFoundException(`Expense with ID ${id} not found`);

    await this.expenseRepository.remove(expense);
    return {
      message: 'Expense deleted successfully',
      data: [],
    };
  }

  async getCurrentMonthTotalExpense(): Promise<{ message: string; data: any }> {
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
      message: 'Total expense fetched successfully',
      data: {
        year,
        month: month + 1,
        totalExpense: Number(result.total),
      },
    };
  }

async searchExpenses(
  year?: number,
  month?: number,
  title?: string,
  category?: string
): Promise<{ message: string; data: any[] }> {
  const now = new Date();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Case: Only month → use current year
  if (!year && month) {
    year = now.getFullYear();
  }

  // At least one filter must exist
  if (!year && !month && !title && !category) {
    throw new BadRequestException('At least one filter (year, month, title, category) must be provided');
  }

  // Build startDate and endDate if year or month is provided
  let startDate: Date | undefined;
  let endDate: Date | undefined;

  if (year) {
    if (month) {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 1);
    } else {
      startDate = new Date(year, 0, 1);
      endDate = new Date(year + 1, 0, 1);
    }
  }

  // Build query
  const queryBuilder = this.expenseRepository.createQueryBuilder('expense');

  if (startDate && endDate) {
    queryBuilder.andWhere('expense.date >= :startDate AND expense.date < :endDate', { startDate, endDate });
  }

  if (title) {
    queryBuilder.andWhere('expense.title ILIKE :title', { title: `%${title}%` });
  }

  if (category) {
    queryBuilder.andWhere('expense.category ILIKE :category', { category: `%${category}%` });
  }

  queryBuilder.orderBy('expense.date', 'DESC');

  const expenses = await queryBuilder.getMany();

  // Handle no results
  if (!expenses.length) {
    let message = 'No expenses found';

    if (year && month && title && category)
      message = `No expenses found for "${title}" in "${category}" for ${months[month - 1]} ${year}`;
    else if (year && month && title)
      message = `No expenses found for "${title}" in ${months[month - 1]} ${year}`;
    else if (year && month && category)
      message = `No expenses found in "${category}" for ${months[month - 1]} ${year}`;
    else if (year && month)
      message = `No expenses found for ${months[month - 1]} ${year}`;
    else if (year && title)
      message = `No expenses found for "${title}" in year ${year}`;
    else if (year && category)
      message = `No expenses found in "${category}" for year ${year}`;
    else if (month && title)
      message = `No expenses found for "${title}" in ${months[month - 1]} ${now.getFullYear()}`;
    else if (month && category)
      message = `No expenses found in "${category}" for ${months[month - 1]} ${now.getFullYear()}`;
    else if (year)
      message = `No expenses found for year ${year}`;
    else if (month)
      message = `No expenses found for ${months[month - 1]} ${year || now.getFullYear()}`;
    else if (title && category)
      message = `No expenses found for "${title}" in "${category}"`;
    else if (title)
      message = `No expenses found for title "${title}"`;
    else if (category)
      message = `No expenses found for category "${category}"`;

    return { message, data: [] };
  }

  // Format results
  const data = expenses.map(exp => ({
    id: exp.id,
    title: exp.title,
    category: exp.category,
    amount: exp.amount,
    date: this.formatDate(exp.date),
  }));

  return {
    message: 'Expenses fetched successfully',
    data,
  };
}


}
