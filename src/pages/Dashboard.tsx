import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Sidebar } from '@/components/Sidebar';
import { TaskList } from '@/components/TaskList';
import { TaskForm } from '@/components/TaskForm';
import { TaskStats } from '@/components/TaskStats';
import { Task, Category } from '@/types';

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all');

  // Load initial data
  useEffect(() => {
    // Load categories
    const defaultCategories: Category[] = [
      { id: '1', name: 'Work', color: '#4A6FA5' },
      { id: '2', name: 'Personal', color: '#47B881' },
      { id: '3', name: 'Shopping', color: '#F5B041' },
      { id: '4', name: 'Health', color: '#E74C3C' },
    ];
    setCategories(defaultCategories);
    
    // Load sample tasks
    const sampleTasks: Task[] = [
      {
        id: '1',
        title: 'Complete project proposal',
        description: 'Finish the quarterly project proposal for the client',
        completed: false,
        priority: 'high',
        categoryId: '1',
        dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
        createdAt: new Date(),
      },
      {
        id: '2',
        title: 'Buy groceries',
        description: 'Milk, eggs, bread, and vegetables',
        completed: false,
        priority: 'medium',
        categoryId: '3',
        dueDate: new Date(Date.now() + 86400000), // 1 day from now
        createdAt: new Date(),
      },
      {
        id: '3',
        title: 'Morning jog',
        description: '30 minutes jogging in the park',
        completed: true,
        priority: 'low',
        categoryId: '4',
        dueDate: new Date(),
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
      },
      {
        id: '4',
        title: 'Call mom',
        description: "Don't forget to wish her happy birthday",
        completed: false,
        priority: 'high',
        categoryId: '2',
        dueDate: new Date(),
        createdAt: new Date(),
      },
    ];
    setTasks(sampleTasks);
  }, []);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
    toast.success("Task added successfully");
    setIsAddingTask(false);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    toast.success("Task updated successfully");
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success("Task deleted successfully");
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    }));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories([...categories, newCategory]);
    toast.success("Category added successfully");
  };

  const deleteCategory = (categoryId: string) => {
    // Check if there are tasks in this category
    const tasksInCategory = tasks.filter(task => task.categoryId === categoryId);
    if (tasksInCategory.length > 0) {
      toast.error("Cannot delete category with tasks. Please move or delete the tasks first.");
      return;
    }
    
    setCategories(categories.filter(category => category.id !== categoryId));
    if (activeCategory === categoryId) {
      setActiveCategory(null);
    }
    toast.success("Category deleted successfully");
  };

  // Filter tasks based on active category, search query, and completion status
  const filteredTasks = tasks.filter(task => {
    // Filter by category
    if (activeCategory && task.categoryId !== activeCategory) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by completion status
    if (filter === 'completed' && !task.completed) {
      return false;
    }
    if (filter === 'active' && task.completed) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        categories={categories} 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory}
        addCategory={addCategory}
        deleteCategory={deleteCategory}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <TaskStats tasks={tasks} />
            
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl font-bold text-foreground">
                  {activeCategory 
                    ? `${categories.find(c => c.id === activeCategory)?.name} Tasks` 
                    : 'All Tasks'}
                </h1>
                
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-neumorphic px-3 py-2 text-sm w-full md:w-64"
                  />
                  
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as 'all' | 'completed' | 'active')}
                    className="input-neumorphic px-3 py-2 text-sm"
                  >
                    <option value="all">All Tasks</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              
              {isAddingTask ? (
                <TaskForm 
                  onSubmit={addTask} 
                  onCancel={() => setIsAddingTask(false)} 
                  categories={categories}
                />
              ) : (
                <button
                  onClick={() => setIsAddingTask(true)}
                  className="btn btn-primary w-full md:w-auto"
                >
                  Add New Task
                </button>
              )}
              
              <TaskList 
                tasks={filteredTasks} 
                categories={categories}
                onToggleComplete={toggleTaskCompletion}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
