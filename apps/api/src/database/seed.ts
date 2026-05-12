import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../app.module';
import { UserRepository } from '../features/auth/user.repository';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userRepository = app.get(UserRepository);

  const adminEmail = 'admin@admin.com';
  const adminPassword = 'password123';

  console.log('🌱 Seeding database...');

  const existingUser = await userRepository.findByEmail(adminEmail);
  if (existingUser) {
    console.log('✅ Admin user already exists.');
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await userRepository.create({
      email: adminEmail,
      password: hashedPassword,
    });
    console.log('👤 Admin user created successfully!');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
  }

  await app.close();
  console.log('🏁 Seeding completed.');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
