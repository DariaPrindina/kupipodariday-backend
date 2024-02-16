import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;
    const hashPassword = await this.hashService.createHash(password);
    const newUser = this.userRepository.create({
      ...rest,
      password: hashPassword,
    });
    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    const allUsers = await this.userRepository.find();
    return allUsers;
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  async updateOneById(id: number, updateUserDto: UpdateUserDto) {
    const { password, ...rest } = updateUserDto;
    if (updateUserDto.password) {
      const hashPassword = await this.hashService.createHash(password);
      const updateUser = await this.userRepository.update(id, {
        ...rest,
        password: hashPassword,
      });
      return updateUser;
    } else {
      const updateUser = await this.userRepository.update(id, {
        ...rest,
      });
      return updateUser;
    }
  }

  async removeOneById(id: number) {
    await this.userRepository.delete(id);
  }
}
