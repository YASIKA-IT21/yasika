import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Admin from './Admin';
import './Employee.css';

const Employee = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [designation, setDesignation] = useState('');
  const [gender, setGender] = useState('');
  const [course, setCourse] = useState([]);
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState(''); // Add username state
  const [message, setMessage] = useState('');
  const [imageError, setImageError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');

  const navigate = useNavigate();

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    if (course.includes(value)) {
      setCourse(course.filter((c) => c !== value));
    } else {
      setCourse([...course, value]);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setImageError('');
    setEmailError('');
    setMobileError('');

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const mobileRegex = /^\d{10}$/;

    if (image && !/\.(png|jpg)$/.test(image.name)) {
        setImageError('Image must be in PNG or JPG format.');
        return;
    }

    if (!emailRegex.test(email)) {
        setEmailError('Email is not valid.');
        return;
    }

    if (!mobileRegex.test(mobileNo)) {
        setMobileError('Mobile number must be 10 digits.');
        return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('mobile_no', mobileNo);
    formData.append('designation', designation);
    formData.append('gender', gender);
    formData.append('course', JSON.stringify(course));
    if (image) formData.append('image', image);

    try {
        const response = await axios.post('http://localhost:3005/api/create_employee', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Employee created:', response.data);
        setMessage('Employee created successfully');
        navigate('/admin'); // Redirect to a success page or another component
    } catch (error) {
        console.error('Error creating employee:', error.response.data); // Log the error response data
        setMessage('Error creating employee');
    }
};
  return (
    <div>
     <Admin showCreateEmployee={false} showmobile={false} />
      <div className="employee-form-container">
        <form className="employee-form" onSubmit={handleFormSubmit}>
          
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="mobile">Mobile No:</label>
            <input type="text" id="mobile" name="mobile" value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} />
            {mobileError && <p className="error-message">{mobileError}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="designation">Designation:</label>
            <select id="designation" name="designation" value={designation} onChange={(e) => setDesignation(e.target.value)}>
              <option value="">Select</option>
              <option value="manager">Manager</option>
              <option value="hr">HR</option>
              <option value="sales">Sales</option>
            </select>
          </div>
          <div className="form-group">
            <label>Gender:</label>
            <div className="radio-group">
              <input type="radio" id="male" name="gender" value="male" checked={gender === 'male'} onChange={(e) => setGender(e.target.value)} />
              <label htmlFor="male">Male</label>
              <input type="radio" id="female" name="gender" value="female" checked={gender === 'female'} onChange={(e) => setGender(e.target.value)} />
              <label htmlFor="female">Female</label>
            </div>
          </div>
          <div className="form-group">
            <label>Course:</label>
            <div className="checkbox-group">
              <input type="checkbox" id="course1" name="course" value="MCA" checked={course.includes('MCA')} onChange={handleCheckboxChange} />
              <label htmlFor="course1">MCA</label>
              <input type="checkbox" id="course2" name="course" value="BCA" checked={course.includes('BCA')} onChange={handleCheckboxChange} />
              <label htmlFor="course2">BCA</label>
              <input type="checkbox" id="course3" name="course" value="BSC" checked={course.includes('BSC')} onChange={handleCheckboxChange} />
              <label htmlFor="course3">BSC</label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="imageUpload">Image Upload:</label>
            <input type="file" id="imageUpload" name="imageUpload" onChange={(e) => setImage(e.target.files[0])} />
            {imageError && <p className="error-message">{imageError}</p>}
          </div>
          <button type="submit">Submit</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Employee;
