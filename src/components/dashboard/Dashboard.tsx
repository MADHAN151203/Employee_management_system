import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { 
  UsersIcon, 
  BuildingOfficeIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { employees, departments, attendance } = useData();

  // Calculate metrics
  const totalEmployees = employees.length;
  const totalDepartments = departments.length;
  const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
  const averageSalary = employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length;
  
  const presentToday = attendance.filter(att => att.status === 'Present').length;
  const attendanceRate = attendance.length > 0 ? (presentToday / attendance.length) * 100 : 0;

  // Chart data
  const departmentData = departments.map(dept => ({
    name: dept.name,
    employees: dept.employeeCount,
    budget: dept.budget / 1000, // Convert to thousands
  }));

  const salaryData = departments.map(dept => ({
    name: dept.name,
    averageSalary: dept.averageSalary / 1000,
  }));

  const statusData = [
    { name: 'Active', value: activeEmployees, color: '#10B981' },
    { name: 'Inactive', value: totalEmployees - activeEmployees, color: '#EF4444' },
  ];

  const attendanceData = [
    { name: 'Present', value: presentToday, color: '#10B981' },
    { name: 'Absent', value: attendance.length - presentToday, color: '#EF4444' },
  ];

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ElementType;
    change?: string;
    changeType?: 'positive' | 'negative';
    color: string;
  }> = ({ title, value, icon: Icon, change, changeType, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'positive' ? (
                <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
              )}
              <span className="text-sm">{change}</span>
            </div>
          )}
        </div>
        <Icon className="w-12 h-12" style={{ color }} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-blue-100">
          Here's an overview of your {user?.role === 'Admin' ? 'organization' : 'department'} today.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={totalEmployees}
          icon={UsersIcon}
          change="+12% from last month"
          changeType="positive"
          color="#3B82F6"
        />
        <StatCard
          title="Departments"
          value={totalDepartments}
          icon={BuildingOfficeIcon}
          color="#10B981"
        />
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate.toFixed(1)}%`}
          icon={ClockIcon}
          change="+5% from yesterday"
          changeType="positive"
          color="#F59E0B"
        />
        <StatCard
          title="Average Salary"
          value={`$${(averageSalary / 1000).toFixed(0)}K`}
          icon={CurrencyDollarIcon}
          change="+8% from last quarter"
          changeType="positive"
          color="#8B5CF6"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Employee Count */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Employees by Department
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="employees" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Employee Status Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Employee Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={(entry) => `${entry.name}: ${entry.value}`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Average Salary by Department */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Average Salary by Department (K$)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salaryData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="averageSalary" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Today's Attendance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={attendanceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={(entry) => `${entry.name}: ${entry.value}`}
              >
                {attendanceData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <UsersIcon className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">New employee added</p>
              <p className="text-xs text-gray-500">John Doe joined the IT department</p>
            </div>
            <span className="text-xs text-gray-400 ml-auto">2 hours ago</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <ClockIcon className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Attendance updated</p>
              <p className="text-xs text-gray-500">Monthly attendance report generated</p>
            </div>
            <span className="text-xs text-gray-400 ml-auto">4 hours ago</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <BuildingOfficeIcon className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Department budget updated</p>
              <p className="text-xs text-gray-500">IT department budget increased by 10%</p>
            </div>
            <span className="text-xs text-gray-400 ml-auto">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;