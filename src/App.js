import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Calendar, 
  Search,
  CheckCircle,
  Circle,
  Star
} from 'lucide-react';
import './App.css';

const TASK_STATUSES = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed'
};

const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

const PRIORITY_COLORS = {
  [PRIORITY_LEVELS.LOW]: 'bg-green-100 text-green-800 border-green-200',
  [PRIORITY_LEVELS.MEDIUM]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [PRIORITY_LEVELS.HIGH]: 'bg-red-100 text-red-800 border-red-200'
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: PRIORITY_LEVELS.MEDIUM,
    dueDate: ''
  });
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('pt-task-manager-data');
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        if (Array.isArray(parsedTasks)) {
          setTasks(parsedTasks);
        }
      }
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      // If there's an error, start with empty tasks
      setTasks([]);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem('pt-task-manager-data', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }, [tasks]);

  const addTask = () => {
    if (newTask.title.trim() === '') return;

    const task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      status: TASK_STATUSES.TODO,
      dueDate: newTask.dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      priority: PRIORITY_LEVELS.MEDIUM,
      dueDate: ''
    });
    setShowAddForm(false);
  };

  const updateTask = (taskId, updates) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const toggleTaskStatus = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    let newStatus;
    switch (task.status) {
      case TASK_STATUSES.TODO:
        newStatus = TASK_STATUSES.IN_PROGRESS;
        break;
      case TASK_STATUSES.IN_PROGRESS:
        newStatus = TASK_STATUSES.COMPLETED;
        break;
      case TASK_STATUSES.COMPLETED:
        newStatus = TASK_STATUSES.TODO;
        break;
      default:
        newStatus = TASK_STATUSES.TODO;
    }

    updateTask(taskId, { status: newStatus });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId !== destination.droppableId) {
      const taskId = result.draggableId;
      const newStatus = destination.droppableId;
      updateTask(taskId, { status: newStatus });
    }
  };

  const startEditing = (task) => {
    setEditingTask({ ...task });
  };

  const saveEdit = () => {
    if (!editingTask) return;
    updateTask(editingTask.id, editingTask);
    setEditingTask(null);
  };

  const cancelEdit = () => {
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getTasksByStatus = (status) => {
    return filteredTasks.filter(task => task.status === status);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  const TaskCard = ({ task, index }) => (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 transition-all duration-200 hover:shadow-md ${
            snapshot.isDragging ? 'shadow-lg rotate-1' : ''
          }`}
        >
          {editingTask && editingTask.id === task.id ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editingTask.title}
                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Task title"
              />
              <textarea
                value={editingTask.description}
                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Task description"
                rows="2"
              />
              <div className="flex space-x-2">
                <select
                  value={editingTask.priority}
                  onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                  className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value={PRIORITY_LEVELS.LOW}>Low</option>
                  <option value={PRIORITY_LEVELS.MEDIUM}>Medium</option>
                  <option value={PRIORITY_LEVELS.HIGH}>High</option>
                </select>
                <input
                  type="date"
                  value={editingTask.dueDate}
                  onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                  className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={saveEdit}
                  className="flex items-center px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex items-center px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-primary-500 transition-colors"
                  >
                    {task.status === TASK_STATUSES.COMPLETED ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <h3 className={`font-medium text-gray-900 ${
                    task.status === TASK_STATUSES.COMPLETED ? 'line-through text-gray-500' : ''
                  }`}>
                    {task.title}
                  </h3>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => startEditing(task)}
                    className="p-1 text-gray-400 hover:text-primary-500 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {task.description && (
                <p className="text-gray-600 text-sm mb-3">{task.description}</p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${PRIORITY_COLORS[task.priority]}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                  {task.priority === PRIORITY_LEVELS.HIGH && (
                    <Star className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
                
                {task.dueDate && (
                  <div className={`flex items-center space-x-1 text-xs ${
                    isOverdue(task.dueDate) ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(task.dueDate)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );

  const TaskColumn = ({ title, status, tasks, bgColor }) => (
    <div className="flex-1 min-w-0">
      <div className={`${bgColor} rounded-lg p-4 h-full`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600">
            {tasks.length}
          </span>
        </div>
        <Droppable droppableId={status}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`space-y-2 min-h-[200px] transition-colors ${
                snapshot.isDraggingOver ? 'bg-blue-50 rounded-lg' : ''
              }`}
            >
              {tasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">PT</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Task Manager</h1>
                <p className="text-sm text-gray-500">by Prem Thakur</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value={TASK_STATUSES.TODO}>To Do</option>
                <option value={TASK_STATUSES.IN_PROGRESS}>In Progress</option>
                <option value={TASK_STATUSES.COMPLETED}>Completed</option>
              </select>
              
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Priority</option>
                <option value={PRIORITY_LEVELS.LOW}>Low</option>
                <option value={PRIORITY_LEVELS.MEDIUM}>Medium</option>
                <option value={PRIORITY_LEVELS.HIGH}>High</option>
              </select>
              
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </button>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PT</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Task Manager</h1>
                  <p className="text-xs text-gray-500">by Prem Thakur</p>
                </div>
              </div>
              
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center px-3 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </button>
            </div>
            
            {/* Mobile Search and Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Status</option>
                  <option value={TASK_STATUSES.TODO}>To Do</option>
                  <option value={TASK_STATUSES.IN_PROGRESS}>In Progress</option>
                  <option value={TASK_STATUSES.COMPLETED}>Completed</option>
                </select>
                
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Priority</option>
                  <option value={PRIORITY_LEVELS.LOW}>Low</option>
                  <option value={PRIORITY_LEVELS.MEDIUM}>Medium</option>
                  <option value={PRIORITY_LEVELS.HIGH}>High</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Task</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <textarea
                  placeholder="Task description (optional)"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value={PRIORITY_LEVELS.LOW}>Low Priority</option>
                  <option value={PRIORITY_LEVELS.MEDIUM}>Medium Priority</option>
                  <option value={PRIORITY_LEVELS.HIGH}>High Priority</option>
                </select>
              </div>
              <div>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={addTask}
                className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Columns */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <DragDropContext onDragEnd={onDragEnd}>
          {/* Mobile: Vertical Layout */}
          <div className="md:hidden space-y-6">
            <TaskColumn
              title="To Do"
              status={TASK_STATUSES.TODO}
              tasks={getTasksByStatus(TASK_STATUSES.TODO)}
              bgColor="bg-blue-50"
            />
            <TaskColumn
              title="In Progress"
              status={TASK_STATUSES.IN_PROGRESS}
              tasks={getTasksByStatus(TASK_STATUSES.IN_PROGRESS)}
              bgColor="bg-yellow-50"
            />
            <TaskColumn
              title="Completed"
              status={TASK_STATUSES.COMPLETED}
              tasks={getTasksByStatus(TASK_STATUSES.COMPLETED)}
              bgColor="bg-green-50"
            />
          </div>
          
          {/* Desktop: Grid Layout */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            <TaskColumn
              title="To Do"
              status={TASK_STATUSES.TODO}
              tasks={getTasksByStatus(TASK_STATUSES.TODO)}
              bgColor="bg-blue-50"
            />
            <TaskColumn
              title="In Progress"
              status={TASK_STATUSES.IN_PROGRESS}
              tasks={getTasksByStatus(TASK_STATUSES.IN_PROGRESS)}
              bgColor="bg-yellow-50"
            />
            <TaskColumn
              title="Completed"
              status={TASK_STATUSES.COMPLETED}
              tasks={getTasksByStatus(TASK_STATUSES.COMPLETED)}
              bgColor="bg-green-50"
            />
          </div>
        </DragDropContext>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Desktop Footer */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">PT</span>
              </div>
              <span className="text-sm text-gray-600">
                © 2024 Task Manager by Prem Thakur
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Total Tasks: {tasks.length}</span>
              <span>Completed: {tasks.filter(t => t.status === TASK_STATUSES.COMPLETED).length}</span>
            </div>
          </div>
          
          {/* Mobile Footer */}
          <div className="md:hidden space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-6 h-6 bg-primary-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">PT</span>
              </div>
              <span className="text-sm text-gray-600">
                © 2024 Task Manager by Prem Thakur
              </span>
            </div>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span>Total: {tasks.length}</span>
              <span>Completed: {tasks.filter(t => t.status === TASK_STATUSES.COMPLETED).length}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
