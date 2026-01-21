import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { Expense } from 'src/entities/expense.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { AuthModule } from '../auth/auth.module';
import { Category } from 'src/entities/category.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Expense, Category]),
  ],
  providers: [ExpensesService],
  controllers: [ExpensesController]
})
export class ExpensesModule { }
