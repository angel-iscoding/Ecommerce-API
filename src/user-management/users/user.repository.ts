import { UserDto } from '@/database/dto/user.dto';
import { User } from '@/database/entities/user.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '@/database/entities/role.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    const users: User[] = await this.usersRepository.find();
    return <Omit<User, 'password'>[]>users;
  }

  async getUserById(id: string): Promise<Omit<User, 'password'> | null> {
    return await this.usersRepository.findOne({
      where: { id: id },
      relations: ['orders', 'cart'],
    });
  }

  async findOneByEmail(email: string): Promise<Omit<User, 'password'> | null> {
    return await this.usersRepository.findOne({
      where: { email: email },
      relations: ['orders', 'cart'],
    });
  }

  async searchCompleteUserById(id: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: { id: id },
      relations: ['role'],
    });
  }
  
  async searchCompleteUserByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: { email: email },
      relations: ['role'],
    });
  }
  
  async create(user: UserDto, role: Role): Promise<User> {
    const thisUserExist = await this.findOneByEmail(user.email);

    if (thisUserExist)
      throw new InternalServerErrorException('El usuario ya fue registrado');

    const newUser: User = this.usersRepository.create({
      ...user,
      role: role,
    });
    return await this.usersRepository.save(newUser);
  }

  async save(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }

  async updateUser(
    user: User,
    updatedFields: Partial<User>,
  ): Promise<Omit<User, 'password'> | null> {
    const mergedUser = this.usersRepository.merge(user, updatedFields);
    await this.usersRepository.save(mergedUser);
    return await this.usersRepository.findOne({
      where: { id: user.id },
      select: [
        'id',
        'name',
        'email',
        'address',
        'phone',
        'country',
        'city',
        'role',
        'created_at',
        'updated_at',
      ],
    });
  }

  async deleteUser(id: string): Promise<void> {
    const userToDelete: User = await this.searchCompleteUserById(id);
    if (!userToDelete) return;

    await this.usersRepository.delete(userToDelete.id);
  }
}
