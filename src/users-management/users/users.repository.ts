import { 
  Injectable
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { User } from '@/database/entities/user.entity';
import { IUser } from '@/utils/logger/interfaces/user.interface';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return await this.repository.find({
      select: this.getSafeUserFields(),
      relations: ['orders', 'cart', 'role'],
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['orders', 'cart', 'role'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { email },
      relations: ['orders', 'cart', 'role'],
    });
  }

  async create(createUser: IUser): Promise<User> {
    const newUser = this.repository.create({
      ...createUser
    });

    return await this.repository.save(newUser);
  }

  async update(
    user: User,
    updateData: Partial<User>
  ): Promise<Omit<User, 'password'> | null> {
    const updatedUser = this.repository.merge(user, updateData);
    await this.repository.save(updatedUser);

    return await this.findById(user.id);
  }

  async delete(user: User): Promise<void> {
    await this.repository.remove(user);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { email }
    });
    return count > 0;
  }

  private getSafeUserFields(): (keyof User)[] {
    return [
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
      'orders',
      'cart'
    ];
  }
}