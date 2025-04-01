import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NinjasService } from './ninjas.service';
import { CreateNinjaDto } from './dto/create-ninja.dto';
import { UpdateNinjaDto } from './dto/update-ninja.dto';

@Controller('ninjas')
export class NinjasController {
  constructor(private readonly ninjasService: NinjasService) {}

  @Post()
  create(@Body() createNinjaDto: CreateNinjaDto) {
    return this.ninjasService.create(createNinjaDto);
  }

  @Get()
  findAll() {
    return this.ninjasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ninjasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNinjaDto: UpdateNinjaDto) {
    return this.ninjasService.update(+id, updateNinjaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ninjasService.remove(+id);
  }
}
