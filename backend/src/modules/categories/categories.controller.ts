import { BadRequestException, Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './DTO/create-category.dto';
import { UpdateCategoryDto } from './DTO/update-category.dto';

@ApiTags('Categories')
@ApiBearerAuth('JWT')
@Controller('api/categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post('/create-category')
    @ApiOperation({ summary: 'Create category' })
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.createCategory(createCategoryDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all categories' })
    async getAllCategories() {
        return this.categoriesService.getAllCategories();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get category by ID' })
    async getCategoryById(
        @Param('id', new ParseUUIDPipe({
            version: '4',
            exceptionFactory: () => new BadRequestException('Invalid UUID'),
        }),) id: string,
    ) {
        return this.categoriesService.getCategoryById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update category by ID' })
    async updateCategory(
        @Param(
            'id',
            new ParseUUIDPipe({
                version: '4',
                exceptionFactory: () => new BadRequestException('Invalid UUID'),
            }),
        )
        id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
        return this.categoriesService.updateCategory(id, updateCategoryDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete category by ID' })
    async deleteCategory(
        @Param(
            'id',
            new ParseUUIDPipe({
                version: '4',
                exceptionFactory: () => new BadRequestException('Invalid UUID'),
            }),
        )
        id: string,
    ) {
        return this.categoriesService.deleteCategory(id);
    }

}
