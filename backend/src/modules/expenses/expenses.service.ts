import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Expense } from '../../entities/expense.entity';
import { CreateExpenseDto } from './DTO/create-expense.dto';
import { UpdateExpenseDto } from './DTO/update-expense.dto';
import { Category } from 'src/entities/category.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) { }

  async createExpense(
    createExpenseDto: CreateExpenseDto,
  ): Promise<{ message: string; data: any }> {

    const { title, categoryId, amount, date: dateString } = createExpenseDto;

    const trimmedTitle = title.trim();

    // 🔹 Parse date (dd-mm-yyyy)
    const [day, month, year] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    // 🔹 Check duplicate (same title + same date)
    const existingExpense = await this.expenseRepository
      .createQueryBuilder('expense')
      .where('LOWER(expense.title) = LOWER(:title)', { title: trimmedTitle })
      .andWhere('expense.date = :date', { date })
      .getOne();

    if (existingExpense) {
      throw new BadRequestException(
        'Expense with the same title already exists for this date',
      );
    }

    // 🔹 Fetch Category
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new BadRequestException('Invalid category');
    }

    // 🔹 Create Expense
    const expense = this.expenseRepository.create({
      title: trimmedTitle,
      amount,
      date,
      category, // ✅ assign relation
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
    searchText?: string,
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
    if (!year && !month && !searchText) {
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
    // const queryBuilder = this.expenseRepository.createQueryBuilder('expense');
    const queryBuilder = this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.category', 'category');


    if (startDate && endDate) {
      queryBuilder.andWhere('expense.date >= :startDate AND expense.date < :endDate', { startDate, endDate });
    }

    if (searchText) {
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where('LOWER(expense.title) ILIKE LOWER(:searchText)')
            .orWhere('LOWER(category.name) ILIKE LOWER(:searchText)');
        }),
        { searchText: `%${searchText}%` },
      );
    }


    queryBuilder.orderBy('expense.date', 'DESC');

    const expenses = await queryBuilder.getMany();

    // Handle no results
    if (!expenses.length) {
      let message = 'No expenses found';

      if (year && month && searchText)
        message = `No expenses found for "${searchText}" in ${months[month - 1]} ${year}`;
      else if (year && month)
        message = `No expenses found for ${months[month - 1]} ${year}`;
      else if (year && searchText)
        message = `No expenses found for "${searchText}" in year ${year}`;
      else if (month && searchText)
        message = `No expenses found for "${searchText}" in ${months[month - 1]} ${now.getFullYear()}`;
      else if (year)
        message = `No expenses found for year ${year}`;
      else if (month)
        message = `No expenses found for ${months[month - 1]} ${year || now.getFullYear()}`;
      else if (searchText)
        message = `No expenses found for title "${searchText}"`;
      else if (year && month)
        message = `No expenses found for ${months[month - 1]} ${year}`;
      else if (year && searchText)
        message = `No expenses found for "${searchText}" in year ${year}`;
      else if (month && searchText)
        message = `No expenses found for "${searchText}" in ${months[month - 1]} ${now.getFullYear()}`;
      else if (year)
        message = `No expenses found for year ${year}`;
      else if (month)
        message = `No expenses found for ${months[month - 1]} ${year || now.getFullYear()}`;
      else if (year)
        message = `No expenses found for year ${year}`;
      else if (month)
        message = `No expenses found for ${months[month - 1]} ${year || now.getFullYear()}`;
      else if (searchText)
        message = `No expenses found for title "${searchText}"`;

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
