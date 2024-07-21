import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Admin from './Admin';
import './Employee_list.css';
import { useUser } from './Usercontext';
import { useLocation } from 'react-router-dom';

const Employee_list = () => {
        const serialNumber = JSON.parse(localStorage.getItem('user'))|| ''
    const { user } = useUser(); // Use single user from context
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        console.log('User:', user);
        axios.get('http://localhost:3005/api/employees')
            .then(result => {
                setEmployees(Array.isArray(result.data) ? result.data : []);
            })
            .catch(err => console.log(err));
    }, []);

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3005/api/delete_employees/${id}`)
            .then(() => {
                setEmployees(employees.filter(employee => employee._id !== id));
            })
            .catch(err => console.log(err));
    };

    const sortEmployees = (field, direction) => {
        const sortedEmployees = [...employees].sort((a, b) => {
            if (field === 'createdAt') {
                const dateA = new Date(a[field]);
                const dateB = new Date(b[field]);
                return direction === 'asc' ? dateA - dateB : dateB - dateA;
            }
            if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
            if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sortedEmployees;
    };

    const sortedEmployees = sortEmployees(sortField, sortDirection);

    const filteredEmployees = sortedEmployees.filter(employee => {
        const { name, email, mobile_no, course, designation, gender } = employee;
        const lowerCaseTerm = searchTerm.toLowerCase();
        return (
            name.toLowerCase().includes(lowerCaseTerm) ||
            email.toLowerCase().includes(lowerCaseTerm) ||
            gender.toLowerCase().includes(lowerCaseTerm) ||
            mobile_no.includes(searchTerm) ||
            course.join(', ').toLowerCase().includes(lowerCaseTerm) ||
            designation.toLowerCase().includes(lowerCaseTerm)
        );
    });

    const handleSortChange = (event) => {
        const [field, direction] = event.target.value.split('|');
        setSortField(field);
        setSortDirection(direction);
    };

    return (
        <div className="employee-list-container">
            <Admin showCreateEmployee={true} showmobile={false} />
            <div className="employee-summary">
              
                <h2>Total Employees: {employees.length}</h2>
            </div>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by name, email, phone, course, or designation"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>
            <div className="sort-container">
                <label htmlFor="sort-select">Sort by:</label>
                <select id="sort-select" onChange={handleSortChange}>
                    <option value="name|asc">Name (A-Z)</option>
                    <option value="name|desc">Name (Z-A)</option>
                    <option value="email|asc">Email (A-Z)</option>
                    <option value="email|desc">Email (Z-A)</option>
                    <option value="mobile_no|asc">Mobile No (Ascending)</option>
                    <option value="mobile_no|desc">Mobile No (Descending)</option>
                    <option value="designation|asc">Designation (A-Z)</option>
                    <option value="designation|desc">Designation (Z-A)</option>
                    <option value="gender|asc">Gender (A-Z)</option>
                    <option value="gender|desc">Gender (Z-A)</option>
                    <option value="course|asc">Course (A-Z)</option>
                    <option value="course|desc">Course (Z-A)</option>
                    <option value="createdAt|asc">Created Date (Oldest)</option>
                    <option value="createdAt|desc">Created Date (Newest)</option>
                </select>
            </div>
            <table className="employee-table">
                <thead>
                    <tr>
                        <th>Unique id</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile No</th>
                        <th>Designation</th>
                        <th>Gender</th>
                        <th>Course</th>
                        <th>Created Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredEmployees.map((employee) => (
                            
                            <tr key={employee._id}>
                                <td>{serialNumber}</td>
                                <td>
                                    {employee.image ? (
                                        <img
                                            src={`${employee.image}`}
                                            alt={employee.name}
                                            className="employee-image"
                                        />
                                    ) : (
                                        <p>No Image</p>
                                    )}
                                </td>
                                <td>{employee.name}</td>
                                <td>{employee.email}</td>
                                <td>{employee.mobile_no}</td>
                                <td>{employee.designation}</td>
                                <td>{employee.gender}</td>
                                <td>{employee.course.join(', ')}</td>
                                <td>{new Date(employee.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button className="edit-button">
                                        <Link to={`/update_employee/${employee._id}`}>Edit</Link>
                                    </button>
                                    <button className="delete-button" onClick={() => handleDelete(employee._id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};

export default Employee_list;
