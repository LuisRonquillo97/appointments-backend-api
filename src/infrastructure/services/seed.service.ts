import { User } from '../entities/user';
import { AppDataSource } from '../config/database';
import { AuthService } from '../../domain/services/auth.service';
import { UserRole } from '../../domain/enums/user-role.enum';

export class SeedService {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async seedUsers(): Promise<void> {
    try {
      const userRepository = AppDataSource.getRepository(User);

      // Check if admin user already exists
      const adminExists = await userRepository.findOne({ where: { email: 'admin@example.com' } });

      if (!adminExists) {
        console.log('Seeding admin user...');

        const hashedPassword = await this.authService.hashPassword('Admin123!');
        const admin = userRepository.create({
          email: 'admin@example.com',
          password: hashedPassword,
          name: 'Administrator',
          role: UserRole.ADMIN,
        });

        await userRepository.save(admin);
        console.log('Admin user created successfully');
      } else {
        console.log('Admin user already exists, skipping seed');
      }
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  }
}
