import { useMemo } from 'react';
import { Task } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertCircle, BarChart } from 'lucide-react';

interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const highPriority = tasks.filter(task => task.priority === 'high' && !task.completed).length;
    
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return {
      total,
      completed,
      pending,
      highPriority,
      completionRate
    };
  }, [tasks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="card-neumorphic">
        <CardContent className="p-4 flex items-center">
          <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
            <BarChart className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <p className="text-sm text-muted">Total Tasks</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="card-neumorphic">
        <CardContent className="p-4 flex items-center">
          <div className="h-12 w-12 rounded-full bg-success-100 flex items-center justify-center mr-4">
            <CheckCircle className="h-6 w-6 text-success-600" />
          </div>
          <div>
            <p className="text-sm text-muted">Completed</p>
            <p className="text-2xl font-bold">{stats.completed}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="card-neumorphic">
        <CardContent className="p-4 flex items-center">
          <div className="h-12 w-12 rounded-full bg-warning-100 flex items-center justify-center mr-4">
            <Clock className="h-6 w-6 text-warning-600" />
          </div>
          <div>
            <p className="text-sm text-muted">Pending</p>
            <p className="text-2xl font-bold">{stats.pending}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="card-neumorphic">
        <CardContent className="p-4 flex items-center">
          <div className="h-12 w-12 rounded-full bg-danger-100 flex items-center justify-center mr-4">
            <AlertCircle className="h-6 w-6 text-danger-600" />
          </div>
          <div>
            <p className="text-sm text-muted">High Priority</p>
            <p className="text-2xl font-bold">{stats.highPriority}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="card-neumorphic md:col-span-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Completion Rate</p>
            <p className="text-sm font-medium">{stats.completionRate}%</p>
          </div>
          <Progress value={stats.completionRate} className="h-2" />
        </CardContent>
      </Card>
    </div>
  );
}
