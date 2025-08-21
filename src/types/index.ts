export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  categoryId: string;
  dueDate?: Date;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}
