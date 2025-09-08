import React, { useState } from 'react';
import { useData, Department } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  PlusIcon, 
  BuildingOfficeIcon,
  UsersIcon,
  CurrencyDollarIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import DepartmentModal from './DepartmentModal';

const DepartmentList: React.FC = () => {
  const { departments, deleteDepartment } = useData();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const handleCreateDepartment = () => {
    setSelectedDepartment(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteDepartment = (id: string) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      deleteDepartment(id);
    }
  };

  const canManageDepartments = user?.role === 'Admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-1">Manage organizational departments and their resources</p>
        </div>
        
        {canManageDepartments && (
          <button
            onClick={handleCreateDepartment}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Department
          </button>
        )}
      </div>

      {/* Department Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => (
          <div key={department.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
              </div>
              
              {canManageDepartments && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditDepartment(department)}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="Edit Department"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteDepartment(department.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete Department"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Employee Count */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <UsersIcon className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600">Employees</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {department.employeeCount}
                </span>
              </div>

              {/* Budget */}
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">Budget</span>
                </div>
                <span className="text-lg font-semibold text-green-600">
                  ${department.budget.toLocaleString()}
                </span>
              </div>

              {/* Average Salary */}
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-600">Avg. Salary</span>
                </div>
                <span className="text-lg font-semibold text-blue-600">
                  ${department.averageSalary.toLocaleString()}
                </span>
              </div>

              {/* Budget Utilization */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Budget Utilization</span>
                  <span className="text-sm font-medium text-gray-900">
                    {((department.employeeCount * department.averageSalary / department.budget) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min(100, (department.employeeCount * department.averageSalary / department.budget) * 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Department Actions */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                View Employees
              </button>
            </div>
          </div>
        ))}
      </div>

      {departments.length === 0 && (
        <div className="text-center py-12">
          <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No departments</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new department.</p>
          {canManageDepartments && (
            <div className="mt-6">
              <button
                onClick={handleCreateDepartment}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Department
              </button>
            </div>
          )}
        </div>
      )}

      {/* Department Modal */}
      <DepartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        department={selectedDepartment}
        mode={modalMode}
      />
    </div>
  );
};

export default DepartmentList;