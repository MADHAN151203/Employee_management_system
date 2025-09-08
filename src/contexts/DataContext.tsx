import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'HR' | 'Employee';
  department: string;
  salary: number;
  status: 'Active' | 'Inactive';
  joinDate: string;
  phone?: string;
  avatar?: string;
}

export interface Department {
  id: string;
  name: string;
  budget: number;
  employeeCount: number;
  averageSalary: number;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day';
  hoursWorked: number;
}

interface DataContextType {
  employees: Employee[];
  departments: Department[];
  attendance: AttendanceRecord[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  addDepartment: (department: Omit<Department, 'id'>) => void;
  updateDepartment: (id: string, department: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  addAttendance: (attendance: Omit<AttendanceRecord, 'id'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data
const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@company.com',
    role: 'Employee',
    department: 'IT',
    salary: 75000,
    status: 'Active',
    joinDate: '2023-01-15',
    phone: '+1 234-567-8901',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@company.com',
    role: 'HR',
    department: 'HR',
    salary: 65000,
    status: 'Active',
    joinDate: '2022-08-10',
    phone: '+1 234-567-8902',
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@company.com',
    role: 'Employee',
    department: 'Sales',
    salary: 70000,
    status: 'Active',
    joinDate: '2023-03-20',
    phone: '+1 234-567-8903',
  },
];

const mockDepartments: Department[] = [
  { id: '1', name: 'IT', budget: 500000, employeeCount: 15, averageSalary: 75000 },
  { id: '2', name: 'HR', budget: 200000, employeeCount: 5, averageSalary: 65000 },
  { id: '3', name: 'Sales', budget: 300000, employeeCount: 10, averageSalary: 70000 },
  { id: '4', name: 'Finance', budget: 250000, employeeCount: 8, averageSalary: 72000 },
  { id: '5', name: 'Marketing', budget: 180000, employeeCount: 6, averageSalary: 68000 },
];

const mockAttendance: AttendanceRecord[] = [
  {
    id: '1',
    employeeId: '1',
    date: '2024-01-15',
    checkIn: '09:00',
    checkOut: '17:30',
    status: 'Present',
    hoursWorked: 8.5,
  },
  {
    id: '2',
    employeeId: '2',
    date: '2024-01-15',
    checkIn: '09:15',
    checkOut: '17:45',
    status: 'Late',
    hoursWorked: 8.5,
  },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance);

  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: Date.now().toString(),
    };
    setEmployees(prev => [...prev, newEmployee]);
  };

  const updateEmployee = (id: string, updatedEmployee: Partial<Employee>) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === id ? { ...emp, ...updatedEmployee } : emp
    ));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  const addDepartment = (department: Omit<Department, 'id'>) => {
    const newDepartment: Department = {
      ...department,
      id: Date.now().toString(),
    };
    setDepartments(prev => [...prev, newDepartment]);
  };

  const updateDepartment = (id: string, updatedDepartment: Partial<Department>) => {
    setDepartments(prev => prev.map(dept => 
      dept.id === id ? { ...dept, ...updatedDepartment } : dept
    ));
  };

  const deleteDepartment = (id: string) => {
    setDepartments(prev => prev.filter(dept => dept.id !== id));
  };

  const addAttendance = (attendance: Omit<AttendanceRecord, 'id'>) => {
    const newAttendance: AttendanceRecord = {
      ...attendance,
      id: Date.now().toString(),
    };
    setAttendance(prev => [...prev, newAttendance]);
  };

  return (
    <DataContext.Provider value={{
      employees,
      departments,
      attendance,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      addDepartment,
      updateDepartment,
      deleteDepartment,
      addAttendance,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};