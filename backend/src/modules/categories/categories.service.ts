import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { CreateCategoryDto } from './DTO/create-category.dto';
import { UpdateCategoryDto } from './DTO/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) { }

    async createCategory(
        createCategoryDto: CreateCategoryDto,
    ): Promise<{ message: string; data: any }> {

        const name = createCategoryDto.name.trim();

        // 🔹 Prevent duplicate category
        const exists = await this.categoryRepository.findOne({
            where: { name },
        });

        if (exists) {
            throw new BadRequestException('Category already exists');
        }

        const category = this.categoryRepository.create({
            name,
            icon: createCategoryDto.icon,
        });

        const saved = await this.categoryRepository.save(category);

        return {
            message: 'Category created successfully',
            data: {
                id: saved.id,
                name: saved.name,
                icon: saved.icon,
            },
        };
    }

    async getAllCategories(): Promise<{ message: string; data: Category[] }> {
        const categories = await this.categoryRepository.find({
            order: { createdAt: 'DESC' },
        });

        return {
            message: 'Categories fetched successfully',
            data: categories,
        };
    }

    async getCategoryById(id: string): Promise<{ message: string; data: Category }> {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        return {
            message: 'Category fetched successfully',
            data: category,
        };
    }

    async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<{ message: string; data: any }> {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        // Check for duplicate name if name is being updated
        if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
            const existing = await this.categoryRepository.findOne({ where: { name: updateCategoryDto.name } });
            if (existing) {
                throw new BadRequestException(`Category with name "${updateCategoryDto.name}" already exists`);
            }
        }

        // Apply updates
        Object.assign(category, {
            name: updateCategoryDto.name ?? category.name,
            icon: updateCategoryDto.icon ?? category.icon,
        });

        const saved = await this.categoryRepository.save(category);

        return {
            message: 'Category updated successfully',
            data: saved,
        };
    }

    async deleteCategory(id: string): Promise<{ message: string; data: any[] }> {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        await this.categoryRepository.remove(category);

        return {
            message: 'Category deleted successfully',
            data: [],
        };
    }
}
