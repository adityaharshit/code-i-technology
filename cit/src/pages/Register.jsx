import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import useUpload from '../hooks/useUpload';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { statesAndDistricts } from '../utils/statesDistricts';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    email: '',
    username: '',
    password: '',
    studentMobile: '',
    parentMobile: '',
    occupation: '',
    dob: '',
    collegeName: '',
    bloodGroup: '',
    gender: '',
    qualification: '',
    permanentAddress: {
      flatHouseNo: '',
      street: '',
      po: '',
      ps: '',
      district: '',
      state: '',
      pinCode: ''
    },
    localAddress: {
      flatHouseNo: '',
      street: '',
      po: '',
      ps: '',
      district: '',
      state: '',
      pinCode: ''
    },
    photoUrl: ''
  });

  const [sameAddress, setSameAddress] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const { register, loading } = useAuth();
  const { uploadFile, uploading } = useUpload();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('permanentAddress.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        permanentAddress: {
          ...prev.permanentAddress,
          [field]: value
        }
      }));
    } else if (name.startsWith('localAddress.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        localAddress: {
          ...prev.localAddress,
          [field]: value
        }
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSameAddressChange = (e) => {
    setSameAddress(e.target.checked);
    if (e.target.checked) {
      setFormData(prev => ({
        ...prev,
        localAddress: { ...prev.permanentAddress }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        localAddress: {
          flatHouseNo: '',
          street: '',
          po: '',
          ps: '',
          district: '',
          state: '',
          pinCode: ''
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let photoUrl = '';
      if (selectedFile) {
        photoUrl = await uploadFile(selectedFile, 'student-photos');
        if (!photoUrl) {
          toast.error('Failed to upload photo. Please try again.');
          return;
        }
      }

      const submitData = {
        ...formData,
        photoUrl,
        permanentAddress: JSON.stringify(formData.permanentAddress),
        localAddress: JSON.stringify(formData.localAddress)
      };

      await register(submitData);
      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed.');
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['Male', 'Female', 'Other'];
  const qualifications = ['10th', '12th', 'Diploma', 'Bachelor\'s', 'Master\'s', 'PhD', 'Other'];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card className="p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Create an Account</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-secondary border-b border-gray-600 pb-2">
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name *"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <Input
                label="Father's Name *"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                label="Username *"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Password *"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Photo *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-white hover:file:bg-secondary/80"
                  required
                />
                {previewUrl && (
                  <div className="mt-2">
                    <img src={previewUrl} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Student Mobile *"
                name="studentMobile"
                value={formData.studentMobile}
                onChange={handleChange}
                required
              />
              <Input
                label="Parent Mobile *"
                name="parentMobile"
                value={formData.parentMobile}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
              />
              <Input
                label="Date of Birth *"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="College Name"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
              />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Blood Group
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-dark-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-dark-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                >
                  <option value="">Select Gender</option>
                  {genders.map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Qualification
                </label>
                <select
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-dark-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="">Select Qualification</option>
                  {qualifications.map(qual => (
                    <option key={qual} value={qual}>{qual}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Permanent Address */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-secondary border-b border-gray-600 pb-2">
              Permanent Address
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Flat/House No *"
                name="permanentAddress.flatHouseNo"
                value={formData.permanentAddress.flatHouseNo}
                onChange={handleChange}
                required
              />
              <Input
                label="Street *"
                name="permanentAddress.street"
                value={formData.permanentAddress.street}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="PO *"
                name="permanentAddress.po"
                value={formData.permanentAddress.po}
                onChange={handleChange}
                required
              />
              <Input
                label="PS *"
                name="permanentAddress.ps"
                value={formData.permanentAddress.ps}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  State *
                </label>
                <select
                  name="permanentAddress.state"
                  value={formData.permanentAddress.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-dark-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                >
                  <option value="">Select State</option>
                  {Object.keys(statesAndDistricts).map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  District *
                </label>
                <select
                  name="permanentAddress.district"
                  value={formData.permanentAddress.district}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-dark-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                  disabled={!formData.permanentAddress.state}
                >
                  <option value="">Select District</option>
                  {formData.permanentAddress.state && statesAndDistricts[formData.permanentAddress.state]?.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Pin Code *"
                name="permanentAddress.pinCode"
                value={formData.permanentAddress.pinCode}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Local Address */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="sameAddress"
                checked={sameAddress}
                onChange={handleSameAddressChange}
                className="w-4 h-4 text-secondary bg-dark-800 border-gray-600 rounded focus:ring-secondary focus:ring-2"
              />
              <label htmlFor="sameAddress" className="text-sm font-medium text-gray-300">
                Same as Permanent Address
              </label>
            </div>

            <h2 className="text-xl font-semibold text-secondary border-b border-gray-600 pb-2">
              Local Address
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Flat/House No *"
                name="localAddress.flatHouseNo"
                value={formData.localAddress.flatHouseNo}
                onChange={handleChange}
                required
                disabled={sameAddress}
              />
              <Input
                label="Street *"
                name="localAddress.street"
                value={formData.localAddress.street}
                onChange={handleChange}
                required
                disabled={sameAddress}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="PO *"
                name="localAddress.po"
                value={formData.localAddress.po}
                onChange={handleChange}
                required
                disabled={sameAddress}
              />
              <Input
                label="PS *"
                name="localAddress.ps"
                value={formData.localAddress.ps}
                onChange={handleChange}
                required
                disabled={sameAddress}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  State *
                </label>
                <select
                  name="localAddress.state"
                  value={formData.localAddress.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-dark-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-50"
                  required
                  disabled={sameAddress}
                >
                  <option value="">Select State</option>
                  {Object.keys(statesAndDistricts).map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  District *
                </label>
                <select
                  name="localAddress.district"
                  value={formData.localAddress.district}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-dark-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-50"
                  required
                  disabled={sameAddress || !formData.localAddress.state}
                >
                  <option value="">Select District</option>
                  {formData.localAddress.state && statesAndDistricts[formData.localAddress.state]?.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Pin Code *"
                name="localAddress.pinCode"
                value={formData.localAddress.pinCode}
                onChange={handleChange}
                required
                disabled={sameAddress}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            loading={loading || uploading} 
            className="w-full"
            disabled={loading || uploading}
          >
            {uploading ? 'Uploading Photo...' : 'Register'}
          </Button>
        </form>
        <p className="text-center mt-4">
          Already have an account? <Link to="/login" className="text-secondary">Login</Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;