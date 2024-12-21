import React, { useState } from 'react';
import { EmployeesCollection, Employee } from '../api/employees';
import { useTracker } from 'meteor/react-meteor-data';

export const EmployeeList: React.FC = () => {
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

    // Используем useTracker для получения данных из Meteor
    const { employees } = useTracker(() => {
        const handle = Meteor.subscribe('employees');
        const employeesData = handle.ready() ? EmployeesCollection.find().fetch() : [];
        return {
            employees: employeesData,
        };
    }, []);

    const handleEdit = (employee: Employee) => {
        setEditingEmployee(employee);
    };

    const handleDelete = (employee: Employee) => {
        if (confirm(`Вы уверены, что хотите удалить сотрудника ${employee.firstName} ${employee.lastName}?`)) {
            Meteor.call('employees.remove', employee._id, (error: Error) => {
                if (error) {
                    console.error('Ошибка при удалении сотрудника:', error);
                } else {
                    console.log('Сотрудник успешно удалён');
                }
            });
        }
    };

    const handleSave = () => {
        if (editingEmployee && editingEmployee._id) {
            Meteor.call('employees.update', editingEmployee._id, editingEmployee, (error: Error) => {
                if (error) {
                    console.error('Ошибка при обновлении сотрудника:', error);
                } else {
                    console.log('Сотрудник успешно обновлён');
                }
            });
            setEditingEmployee(null);
        }
    };

    const handleChange = (field: keyof Employee, value: any) => {
        setEditingEmployee((prev) =>
            prev ? { ...prev, [field]: value } : null
        );
    };

    return (
        <div>
            <div className="list-container">
                {employees.map((employee) => (
                    <div className="list-item" key={employee._id}>
                        <h3>{employee.firstName} {employee.lastName}</h3>
                        <p>Address: {employee.address || 'N/A'}</p>
                        <p>Birth Date: {new Date(employee.birthDate).toLocaleDateString() || 'N/A'}</p>
                        <p>Position: {employee.position}</p>
                        <p>Salary: {employee.salary}</p>
                        {employee.transfers && employee.transfers.length > 0 && (
                            <div>
                                <h4>Transfers:</h4>
                                <ul>
                                    {employee.transfers.map((transfer, index) => (
                                        <li key={index}>
                                            <p>Position: {transfer.position}</p>
                                            <p>Reason: {transfer.reason || 'N/A'}</p>
                                            <p>Order Number: {transfer.orderNumber || 'N/A'}</p>
                                            <p>Order
                                                Date: {transfer.orderDate ? new Date(transfer.orderDate).toLocaleDateString() : 'N/A'}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <button onClick={() => handleEdit(employee)}>Изменить</button>
                        <button onClick={() => handleDelete(employee)}>Удалить</button>
                    </div>
                ))}
            </div>

            {editingEmployee && (
                <div className="form-container">
                    <h3>Редактирование сотрудника</h3>
                    <input
                        type="text"
                        placeholder="Имя"
                        value={editingEmployee.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Фамилия"
                        value={editingEmployee.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Адрес"
                        value={editingEmployee.address || ''}
                        onChange={(e) => handleChange('address', e.target.value)}
                    />
                    <input
                        type="date"
                        placeholder="Дата рождения"
                        value={editingEmployee.birthDate ? new Date(editingEmployee.birthDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => handleChange('birthDate', new Date(e.target.value))}
                    />
                    <input
                        type="text"
                        placeholder="Должность"
                        value={editingEmployee.position}
                        onChange={(e) => handleChange('position', e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Зарплата"
                        value={editingEmployee.salary || ''}
                        onChange={(e) => handleChange('salary', parseFloat(e.target.value))}
                    />
                    <button onClick={handleSave}>Сохранить</button>
                    <button onClick={() => setEditingEmployee(null)}>Отмена</button>
                </div>
            )}
        </div>
    );
};
