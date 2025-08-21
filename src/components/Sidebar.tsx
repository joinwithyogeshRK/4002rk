import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Home, Plus, Trash2, LogOut, Settings, Menu, X, CheckCircle, Circle, Calendar } from 'lucide-react';

interface SidebarProps {
  categories: Category[];
  activeCategory: string | null;
  setActiveCategory: (categoryId: string | null) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (categoryId: string) => void;
}

const categorySchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
  color: z.string().min(1, { message: "Please select a color" }),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export function Sidebar({ 
  categories, 
  activeCategory, 
  setActiveCategory,
  addCategory,
  deleteCategory
}: SidebarProps) {
  const { user, logout } = useAuth();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      color: '#4A6FA5',
    },
  });

  const onSubmit = (data: CategoryFormValues) => {
    addCategory(data);
    setIsAddingCategory(false);
    form.reset();
  };

  const colorOptions = [
    { value: '#4A6FA5', label: 'Blue' },
    { value: '#47B881', label: 'Green' },
    { value: '#E74C3C', label: 'Red' },
    { value: '#F5B041', label: 'Yellow' },
    { value: '#8E44AD', label: 'Purple' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-primary-600">TaskMaster</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleMobileMenu}
          className="md:hidden"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-medium text-sm">{user?.name}</p>
            <p className="text-xs text-muted">{user?.email}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-1 mb-6">
        <button
          onClick={() => setActiveCategory(null)}
          className={`sidebar-nav-item w-full ${activeCategory === null ? 'sidebar-nav-item-active' : ''}`}
        >
          <Home className="mr-2 h-4 w-4" />
          All Tasks
        </button>
        
        <button className="sidebar-nav-item w-full">
          <Calendar className="mr-2 h-4 w-4" />
          Today
        </button>
        
        <button className="sidebar-nav-item w-full">
          <CheckCircle className="mr-2 h-4 w-4" />
          Completed
        </button>
      </div>
      
      <div className="mb-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-muted">CATEGORIES</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsAddingCategory(true)}
            className="h-6 w-6"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-1">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center group">
              <button
                onClick={() => setActiveCategory(category.id)}
                className={`sidebar-nav-item flex-1 ${activeCategory === category.id ? 'sidebar-nav-item-active' : ''}`}
              >
                <Circle className="mr-2 h-4 w-4" style={{ color: category.color }} />
                {category.name}
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteCategory(category.id)}
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3 w-3 text-danger-500" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-auto pt-6">
        <button className="sidebar-nav-item w-full">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </button>
        <button 
          onClick={logout}
          className="sidebar-nav-item w-full text-danger-500 hover:text-danger-600 hover:bg-danger-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-20 md:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleMobileMenu}
      />
      
      <aside 
        className={`fixed inset-y-0 left-0 w-64 bg-background border-r border-gray-200 p-4 flex flex-col z-40 md:static md:translate-x-0 transition-transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {sidebarContent}
      </aside>
      
      {/* Add Category Dialog */}
      <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Work, Personal, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <div 
                          key={color.value}
                          onClick={() => form.setValue('color', color.value)}
                          className={`w-8 h-8 rounded-full cursor-pointer flex items-center justify-center ${field.value === color.value ? 'ring-2 ring-offset-2' : ''}`}
                          style={{ backgroundColor: color.value }}
                          title={color.label}
                        >
                          {field.value === color.value && (
                            <Check className="h-4 w-4 text-white" />
                          )}
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddingCategory(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="btn-primary">
                  Add Category
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

// This component is only used within the Sidebar component
function Check({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
