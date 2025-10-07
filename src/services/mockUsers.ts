import type { User } from '@/types/index';

export const MOCK_USERS_DATA: (User & { password: string })[] = [
  {
    id: 'user-1',
    name: 'Maria',
    email: 'maria@escola.com',
    password: '123456',
    role: 'teacher',
  },
  {
    id: 'user-2',
    name: 'João',
    email: 'joao@escola.com',
    password: '654321',
    role: 'teacher',
  },
];