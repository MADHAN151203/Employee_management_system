import React, { useState, useEffect } from 'react';
import { useData, Department } from '../../contexts/DataContext';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null;
  mode: 'create' | 'edit';
}

const DepartmentModal: React.FC<DepartmentModalProps> = ({
  isOpen,
  onClose,
  department,
  mode
}) => {
  const { addDepartment, updateDepartment } = useData();
  const [formData, setFormData] = useState({
    name: '',
    budget: '',
    employeeCount: '',
    averageSalary: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (department && mode === 'edit') {
      setFormData({
        name: department.name,
        budget: department.budget.toString(),
        employeeCount: department.employeeCount.toString(),
        averageSalary: department.averageSalary.toString(),
      });
    } else {
      setFormData({
        name: '',
        budget: '',
        employeeCount: '0',
        averageSalary: '',
      });
    }
    setErrors({});
  }, [department, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Department name is required';
    }

    if (!formData.budget.trim()) {
      newErrors.budget = 'Budget is required';
    } else if (isNaN(Number(formData.budget)) || Number(formData.budget) < 0) {
      newErrors.budget = 'Budget must be a valid positive number';
    }

    if (!formData.employeeCount.trim()) {
      newErrors.employeeCount = 'Employee count is required';
    } else if (isNaN(Number(formData.employeeCount)) || Number(formData.employeeCount) < 0) {
      newErrors.employeeCount = 'Employee count must be a valid positive number';
    }

    if (!formData.averageSalary.trim()) {
      newErrors.averageSalary = 'Average salary is required';
    } else if (isNaN(Number(formData.averageSalary)) || Number(formData.averageSalary) < 0) {
      newErrors.averageSalary = 'Average salary must be a valid positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const departmentData: Omit<Department, 'id'> = {
      name: formData.name.trim(),
      budget: Number(formData.budget),
      employeeCount: Number(formData.employeeCount),
      averageSalary: Number(formData.averageSalary),
    };

    if (mode === 'create') {
      addDepartment(departmentData);
    } else if (mode === 'edit' && department) {
      updateDepartment(department.id, departmentData);
    }

    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  const title = mode === 'create' ? 'Add New Department' : 'Edit Department';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Department Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300 ${
                  errors.name ? 'border-red-500' : ''
                }`}
                placeholder="Enter department name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                Annual Budget ($) *
              </label>
              <input
                id="budget"
                name="budget"
                type="number"
                value={formData.budget}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300 ${
                  errors.budget ? 'border-red-500' : ''
                }`}
                placeholder="Enter annual budget"
                min="0"
              />
              {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
            </div>

            <div>
              <label htmlFor="employeeCount" className="block text-sm font-medium text-gray-700 mb-2">
                Current Employee Count *
              </label>
              <input
                id="employeeCount"
                name="employeeCount"
                type="number"
                value={formData.employeeCount}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300 ${
                  errors.employeeCount ? 'border-red-500' : ''
                }`}
                placeholder="Enter current employee count"
                min="0"
              />
              {errors.employeeCount && <p className="text-red-500 text-sm mt-1">{errors.employeeCount}</p>}
            </div>

            <div>
              <label htmlFor="averageSalary" className="block text-sm font-medium text-gray-700 mb-2">
                Average Salary ($) *
              </label>
              <input
                id="averageSalary"
                name="averageSalary"
                type="number"
                value={formData.averageSalary}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300 ${
                  errors.averageSalary ? 'border-red-500' : ''
                }`}
                placeholder="Enter average salary"
                min="0"
              />
              {errors.averageSalary && <p className="text-red-500 text-sm mt-1">{errors.averageSalary}</p>}
            </div>

            {/* Budget Preview */}
            {formData.employeeCount && formData.averageSalary && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Budget Utilization Preview</h4>
                <div className="text-sm text-blue-700">
                  <p>
                    Total Employee Salary Cost: ${(Number(formData.employeeCount) * Number(formData.averageSalary)).toLocaleString()}
                  </p>
                  {formData.budget && (
                    <p>
                      Budget Utilization: {((Number(formData.employeeCount) * Number(formData.averageSalary) / Number(formData.budget)) * 100).toFixed(1)}%
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {mode === 'create' ? 'Create Department' : 'Update Department'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DepartmentModal;