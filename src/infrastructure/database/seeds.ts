// src/infrastructure/database/seeds.ts
import { DataSource } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

export async function seedDatabase(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(UserEntity);

  // Check if default user already exists
  const existingUser = await userRepository.findOne({
    where: { email: 'admin@example.com' },
  });

  if (!existingUser) {
    // Create default user
    const defaultUser = userRepository.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123', // Esta contraseña será encriptada automáticamente por el hook @BeforeInsert
    });

    await userRepository.save(defaultUser);
    console.log('Default user created');
  } else {
    console.log('Default user already exists');
  }
}
