import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Admin from './Admin';
import './Update.css';

const Update = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [designation, setDesignation] = useState('');
    const [gender, setGender] = useState('');
    const [course, setCourse] = useState([]);
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3005/api/employees/${id}`)
            .then(result => {
                const employee = result.data;
                setName(employee.name || '');
                setEmail(employee.email || '');
                setMobileNo(employee.mobile_no || '');
                setDesignation(employee.designation || '');
                setGender(employee.gender || '');
                setCourse(employee.course || []);
                setImage(employee.image || null);
            })
            .catch(err => console.log(err));
    }, [id]);

    const handleCheckboxChange = (event) => {
        const value = event.target.value;
        if (course.includes(value)) {
            setCourse(course.filter((c) => c !== value));
        } else {
            setCourse([...course, value]);
        }
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('mobile_no', mobileNo);
        formData.append('designation', designation);
        formData.append('gender', gender);
        formData.append('course', JSON.stringify(course));
        if (image) formData.append('image', image); // Append image if it exists
    
        axios.put(`http://localhost:3005/api/employees/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(result => {
            console.log(result);
            navigate('/employee_list');
        })
        .catch(err => {
            console.error('Error updating employee:', err);
        });
    };
    
    return (
        <div class="center">
            <Admin showCreateEmployee={false}  showmobile = {false}  />
            <form onSubmit={handleUpdate}>
                <h1>Employee Updation</h1>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="mobile">Mobile No:</label>
                    <input
                        type="text"
                        id="mobile"
                        name="mobile"
                        value={mobileNo}
                        onChange={(e) => setMobileNo(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="designation">Designation:</label>
                    <select
                        id="designation"
                        name="designation"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="manager">Manager</option>
                        <option value="hr">HR</option>
                        <option value="sales">Sales</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Gender:</label>
                    <div className="radio-group">
                        <input
                            type="radio"
                            id="male"
                            name="gender"
                            value="male"
                            checked={gender === 'male'}
                            onChange={(e) => setGender(e.target.value)}
                        />
                        <label htmlFor="male">Male</label>
                        <input
                            type="radio"
                            id="female"
                            name="gender"
                            value="female"
                            checked={gender === 'female'}
                            onChange={(e) => setGender(e.target.value)}
                        />
                        <label htmlFor="female">Female</label>
                    </div>
                </div>
                <div className="form-group">
                    <label>Course:</label>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="course1"
                            name="course"
                            value="MCA"
                            checked={course.includes('MCA')}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="course1">MCA</label>
                        <input
                            type="checkbox"
                            id="course2"
                            name="course"
                            value="BCA"
                            checked={course.includes('BCA')}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="course2">BCA</label>
                        <input
                            type="checkbox"
                            id="course3"
                            name="course"
                            value="BSC"
                            checked={course.includes('BSC')}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="course3">BSC</label>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="image">Image:</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default Update;
