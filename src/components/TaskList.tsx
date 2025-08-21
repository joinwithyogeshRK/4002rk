import { useState } from 'react';
import { format } from 'date-fns';
import { Task, Category } from '@/types';
import { TaskForm } from '@/components/TaskForm';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Calendar, Clock } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  categories: Category[];
  onToggleComplete: (taskId: string) => void;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskList({ tasks, categories, onToggleComplete, onUpdate, onDelete }: TaskListProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'badge badge-danger';
      case 'medium':
        return 'badge badge-warning';
      case 'low':
        return 'badge badge-success';
      default:
        return 'badge';
    }
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || '#4A6FA5';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Uncategorized';
  };

  if (tasks.length === 0) {
    return (
      <div className="card-neumorphic flex flex-col items-center justify-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-medium mb-2">No tasks found</h3>
        <p className="text-muted text-center max-w-md">
          {editingTaskId ? 'No tasks match your current filters.' : 'Add your first task to get started!'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id}>
          {editingTaskId === task.id ? (
            <TaskForm
              task={task}
              onSubmit={(updatedTaskData) => {
                onUpdate({ ...task, ...updatedTaskData });
                setEditingTaskId(null);
              }}
              onCancel={() => setEditingTaskId(null)}
              categories={categories}
            />
          ) : (
            <div className="card-neumorphic">
              <div className="flex items-start gap-3">
                <Checkbox 
                  checked={task.completed} 
                  onCheckedChange={() => onToggleComplete(task.id)}
                  className="mt-1"
                />
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h3 className={`font-medium ${task.completed ? 'line-through text-muted' : ''}`}>
                      {task.title}
                    </h3>
                    
                    <div className="flex items-center gap-2">
                      <span 
                        className="badge badge-primary text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${getCategoryColor(task.categoryId)}20`, color: getCategoryColor(task.categoryId) }}
                      >
                        {getCategoryName(task.categoryId)}
                      </span>
                      
                      <span className={getPriorityBadgeClass(task.priority)}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  
                  {task.description && (
                    <p className={`text-sm mb-3 ${task.completed ? 'text-muted' : ''}`}>
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                    <div className="flex items-center text-xs text-muted">
                      {task.dueDate && (
                        <div className="flex items-center mr-4">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(task.dueDate), 'MMM d, yyyy')}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {format(new Date(task.createdAt), 'MMM d, yyyy')}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setEditingTaskId(task.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0 text-danger-500 hover:text-danger-600 hover:bg-danger-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Task</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this task? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => onDelete(task.id)}
                              className="bg-danger-500 text-white hover:bg-danger-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
