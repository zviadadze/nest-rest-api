import { Injectable } from '@nestjs/common';
import { CreateNinjaDto } from './dto/create-ninja.dto';
import { UpdateNinjaDto } from './dto/update-ninja.dto';

@Injectable()
export class NinjasService {
  create(createNinjaDto: CreateNinjaDto) {
    return 'This action adds a new ninja';
  }

  findAll() {
    return `This action returns all ninjas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ninja`;
  }

  update(id: number, updateNinjaDto: UpdateNinjaDto) {
    return `This action updates a #${id} ninja`;
  }

  remove(id: number) {
    return `This action removes a #${id} ninja`;
  }
}
