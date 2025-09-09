// Enhanced Futuristic Register Page
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import useUpload from '../hooks/useUpload';
import useDebounce from '../hooks/useDebounce';
import { authAPI } from '../services/auth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { statesAndDistricts } from '../utils/statesDistricts';
import toast from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Camera, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Shield, 
  Target, 
  Zap,
  Eye,
  EyeOff,
  Upload,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

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

  const [currentStep, setCurrentStep] = useState(1);
  const [sameAddress, setSameAddress] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [usernameStatus, setUsernameStatus] = useState({ loading: false, available: true, message: '' });
  const [isVisible, setIsVisible] = useState(false);

  const { register, loading } = useAuth();
  const { uploadFile, uploading } = useUpload();
  const navigate = useNavigate();

  const debouncedUsername = useDebounce(formData.username, 500);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const checkUsernameAvailability = useCallback(async (username) => {
    if (!username || username.length < 3) {
      setUsernameStatus({ loading: false, available: true, message: '' });
      return;
    }
    setUsernameStatus({ loading: true, available: false, message: '' });
    try {
      const { data } = await authAPI.checkUsername(username);
      if (data.isAvailable) {
        setUsernameStatus({ loading: false, available: true, message: 'Username is available!' });
      } else {
        setUsernameStatus({ loading: false, available: false, message: 'Username is already taken.' });
      }
    } catch (error) {
      setUsernameStatus({ loading: false, available: false, message: 'Could not check username.' });
    }
  }, []);

  useEffect(() => {
    checkUsernameAvailability(debouncedUsername);
  }, [debouncedUsername, checkUsernameAvailability]);

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
      if (file.size > 500 * 1024) {
        toast.error('File is too large! Maximum size is 500KB.');
        e.target.value = null;
        return;
      }
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

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.fullName && formData.fatherName && formData.email && formData.username && formData.password && formData.studentMobile && formData.parentMobile && formData.dob && formData.gender;
      case 2:
        return formData.permanentAddress.flatHouseNo && formData.permanentAddress.street && formData.permanentAddress.po && formData.permanentAddress.ps && formData.permanentAddress.district && formData.permanentAddress.state && formData.permanentAddress.pinCode;
      case 3:
        return formData.localAddress.flatHouseNo && formData.localAddress.street && formData.localAddress.po && formData.localAddress.ps && formData.localAddress.district && formData.localAddress.state && formData.localAddress.pinCode;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      toast.error('Please fill in all required fields before continuing.');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!usernameStatus.available && formData.username) {
      toast.error('Please choose an available username.');
      return;
    }
    
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
        permanentAddress: formData.permanentAddress,
        localAddress: formData.localAddress,
      };

      await register(submitData);
      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.errors?.[0]?.msg || error.response?.data?.error || 'Registration failed.';
      toast.error(errorMessage);
    }
  };

  const steps = [
    { number: 1, title: 'Personal Info', description: 'Basic information' },
    { number: 2, title: 'Permanent Address', description: 'Home address details' },
    { number: 3, title: 'Local Address', description: 'Current address' },
    { number: 4, title: 'Review', description: 'Confirm details' }
  ];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['Male', 'Female', 'Other'];
  const qualifications = ['10th', '12th', 'Diploma', 'Bachelor\'s', 'Master\'s', 'PhD', 'Other'];

  const renderStepIndicator = () => (
    <div className={`mb-8 ${isVisible ? 'animate-fade-in-down' : 'opacity-0'}`}>
      <Card variant="hologram" className="p-6 mb-8">
        <div className="flex justify-center items-center space-x-2 sm:space-x-6">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className={`flex flex-col items-center group transition-all duration-300 ${
                currentStep >= step.number ? 'text-electric-400' : 'text-gray-500'
              }`}>
                <div className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border-2 flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                  currentStep >= step.number 
                    ? 'border-electric-500 bg-gradient-to-br from-electric-500 to-cyber-500 text-white shadow-glow animate-neural-pulse' 
                    : 'border-quantum-600 bg-quantum-800/50 backdrop-blur-sm'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="w-5 h-5 " />
                  ) : (
                    <span className="font-display">{step.number}</span>
                  )}
                  {/* Floating indicator */}
                  {currentStep === step.number && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-matrix-400 rounded-full " />
                  )}
                </div>
                
                <div className="hidden sm:block text-center mt-3 space-y-1">
                  <div className={`text-sm font-display font-semibold transition-colors duration-300 ${
                    currentStep >= step.number ? 'text-white' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-400">{step.description}</div>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="relative">
                  <div className={`w-8 sm:w-20 h-1 rounded-full transition-all duration-500 ${
                    currentStep > step.number 
                      ? 'bg-gradient-to-r from-electric-500 to-cyber-500 animate-energy-flow' 
                      : 'bg-quantum-700'
                  }`} />
                  {currentStep > step.number && (
                    <div className="absolute inset-0 bg-gradient-to-r from-electric-500/20 to-cyber-500/20 rounded-full blur-sm " />
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Progress percentage */}
        <div className="mt-6 text-center">
          <div className="text-sm text-gray-300 mb-2">
            Step {currentStep} of {steps.length} - {Math.round((currentStep / steps.length) * 100)}% Complete
          </div>
          <div className="w-full bg-quantum-800 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-electric-500 to-cyber-500 rounded-full transition-all duration-500 animate-energy-flow"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className={`space-y-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-electric-400 to-cyber-500 bg-clip-text text-transparent flex items-center">
          <User className="w-7 h-7 mr-3 text-electric-400 " />
          Personal Information
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-electric-500 to-cyber-500 rounded-full animate-energy-flow" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Enhanced Full Name Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Full Name *</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-electric-400" />
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="w-full pl-12 pr-4 py-3 bg-quantum-800/50 border border-electric-500/30 rounded-xl text-white placeholder-gray-400 focus:border-electric-500 focus:ring-2 focus:ring-electric-500/20 focus:outline-none transition-all duration-300 backdrop-blur-sm"
            />
            {formData.fullName && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-matrix-400 rounded-full " />
            )}
          </div>
        </div>

        {/* Enhanced Father's Name Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Father's Name *</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyber-400" />
            <input
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              required
              placeholder="Enter father's name"
              className="w-full pl-12 pr-4 py-3 bg-quantum-800/50 border border-cyber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20 focus:outline-none transition-all duration-300 backdrop-blur-sm"
            />
            {formData.fatherName && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-matrix-400 rounded-full " />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Enhanced Email Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Email Address *</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-matrix-400" />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email address"
              className="w-full pl-12 pr-4 py-3 bg-quantum-800/50 border border-matrix-500/30 rounded-xl text-white placeholder-gray-400 focus:border-matrix-500 focus:ring-2 focus:ring-matrix-500/20 focus:outline-none transition-all duration-300 backdrop-blur-sm"
            />
            {formData.email && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-matrix-400 rounded-full " />
            )}
          </div>
        </div>

        {/* Enhanced Username Input with Status */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Username *</label>
          <div className="relative">
            <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neural-400" />
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              maxLength="20"
              required
              placeholder="Choose a unique username"
              className="w-full pl-12 pr-12 py-3 bg-quantum-800/50 border border-neural-500/30 rounded-xl text-white placeholder-gray-400 focus:border-neural-500 focus:ring-2 focus:ring-neural-500/20 focus:outline-none transition-all duration-300 backdrop-blur-sm"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {usernameStatus.loading ? (
                <div className="w-5 h-5 border-2 border-neural-400 border-t-transparent rounded-full animate-spin" />
              ) : usernameStatus.available && formData.username ? (
                <CheckCircle className="w-5 h-5 text-matrix-400   " />
              ) : formData.username && !usernameStatus.available ? (
                <AlertCircle className="w-5 h-5 text-red-400 animate-pulse" />
              ) : null}
            </div>
          </div>
          {usernameStatus.loading && (
            <p className="text-xs text-neural-400 flex items-center space-x-2 animate-fade-in-up">
              <div className="w-1 h-1 bg-neural-400 rounded-full animate-pulse" />
              <span>Checking availability...</span>
            </p>
          )}
          {usernameStatus.message && (
            <p className={`text-xs flex items-center space-x-2 animate-fade-in-up ${
              usernameStatus.available ? 'text-matrix-400' : 'text-red-400'
            }`}>
              <div className={`w-1 h-1 rounded-full ${
                usernameStatus.available ? 'bg-matrix-400 ' : 'bg-red-400 animate-pulse'
              }`} />
              <span>{usernameStatus.message}</span>
            </p>
          )}
        </div>
      </div>

      <div className="form-grid-responsive">
        <Input
          label="Password *"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="form-input-responsive"
        />
        <div>
          <label className="form-label-responsive">
            Photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-white hover:file:bg-secondary/80 transition-all duration-200"
          />
          {previewUrl && (
            <div className="mt-3">
              <img src={previewUrl} alt="Preview" className="w-20 h-20 object-cover rounded-lg border-2 border-secondary/50" />
            </div>
          )}
        </div>
      </div>

      <div className="form-grid-responsive">
        <Input
          label="Student Mobile *"
          name="studentMobile"
          value={formData.studentMobile}
          onChange={handleChange}
          maxLength="10"
          pattern="\d{10}"
          title="Please enter a 10-digit mobile number"
          required
          className="form-input-responsive"
        />
        <Input
          label="Parent Mobile *"
          name="parentMobile"
          value={formData.parentMobile}
          onChange={handleChange}
          maxLength="10"
          pattern="\d{10}"
          title="Please enter a 10-digit mobile number"
          required
          className="form-input-responsive"
        />
      </div>

      <div className="form-grid-responsive">
        <Input
          label="Occupation"
          name="occupation"
          value={formData.occupation}
          onChange={handleChange}
          className="form-input-responsive"
        />
        <Input
          label="Date of Birth *"
          name="dob"
          type="date"
          value={formData.dob}
          onChange={handleChange}
          required
          className="form-input-responsive"
        />
      </div>

      <div className="form-grid-responsive">
        <Input
          label="College Name"
          name="collegeName"
          value={formData.collegeName}
          onChange={handleChange}
          className="form-input-responsive"
        />
        <div>
          <label className="form-label-responsive">
            Blood Group
          </label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="form-input-responsive"
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-grid-responsive">
        <div>
          <label className="form-label-responsive">
            Gender *
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="form-input-responsive"
            required
          >
            <option value="">Select Gender</option>
            {genders.map(gender => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label-responsive">
            Qualification
          </label>
          <select
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            className="form-input-responsive"
          >
            <option value="">Select Qualification</option>
            {qualifications.map(qual => (
              <option key={qual} value={qual}>{qual}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderAddressForm = (addressType, title) => (
    <div className={`space-y-6 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
      <h2 className="subheading-responsive text-secondary border-b border-gray-600 pb-2">
        {title}
      </h2>
      
      {addressType === 'localAddress' && (
        <div className="flex items-center space-x-3 mb-4">
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
      )}
      
      <div className="form-grid-responsive">
        <Input
          label="Flat/House No *"
          name={`${addressType}.flatHouseNo`}
          value={formData[addressType].flatHouseNo}
          onChange={handleChange}
          required
          disabled={addressType === 'localAddress' && sameAddress}
          className="form-input-responsive"
        />
        <Input
          label="Street *"
          name={`${addressType}.street`}
          value={formData[addressType].street}
          onChange={handleChange}
          required
          disabled={addressType === 'localAddress' && sameAddress}
          className="form-input-responsive"
        />
      </div>

      <div className="form-grid-responsive">
        <Input
          label="PO *"
          name={`${addressType}.po`}
          value={formData[addressType].po}
          onChange={handleChange}
          required
          disabled={addressType === 'localAddress' && sameAddress}
          className="form-input-responsive"
        />
        <Input
          label="PS *"
          name={`${addressType}.ps`}
          value={formData[addressType].ps}
          onChange={handleChange}
          required
          disabled={addressType === 'localAddress' && sameAddress}
          className="form-input-responsive"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div>
          <label className="form-label-responsive">
            State *
          </label>
          <select
            name={`${addressType}.state`}
            value={formData[addressType].state}
            onChange={handleChange}
            className="form-input-responsive"
            required
            disabled={addressType === 'localAddress' && sameAddress}
          >
            <option value="">Select State</option>
            {Object.keys(statesAndDistricts).map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label-responsive">
            District *
          </label>
          <select
            name={`${addressType}.district`}
            value={formData[addressType].district}
            onChange={handleChange}
            className="form-input-responsive"
            required
            disabled={(addressType === 'localAddress' && sameAddress) || !formData[addressType].state}
          >
            <option value="">Select District</option>
            {formData[addressType].state && statesAndDistricts[formData[addressType].state]?.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
        <Input
          label="Pin Code *"
          name={`${addressType}.pinCode`}
          value={formData[addressType].pinCode}
          onChange={handleChange}
          required
          disabled={addressType === 'localAddress' && sameAddress}
          className="form-input-responsive"
        />
      </div>
    </div>
  );

  const renderReview = () => (
    <div className={`space-y-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
      <h2 className="subheading-responsive text-secondary border-b border-gray-600 pb-2">
        Review Your Information
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 glass-subtle">
          <h3 className="text-lg font-semibold text-white mb-4">Personal Details</h3>
          <div className="space-y-2 text-sm">
            <div><span className="text-gray-400">Name:</span> <span className="text-white">{formData.fullName}</span></div>
            <div><span className="text-gray-400">Father's Name:</span> <span className="text-white">{formData.fatherName}</span></div>
            <div><span className="text-gray-400">Email:</span> <span className="text-white">{formData.email}</span></div>
            <div><span className="text-gray-400">Username:</span> <span className="text-white">{formData.username}</span></div>
            <div><span className="text-gray-400">Mobile:</span> <span className="text-white">{formData.studentMobile}</span></div>
            <div><span className="text-gray-400">Gender:</span> <span className="text-white">{formData.gender}</span></div>
            <div><span className="text-gray-400">DOB:</span> <span className="text-white">{formData.dob}</span></div>
          </div>
        </Card>
        
        <Card className="p-6 glass-subtle">
          <h3 className="text-lg font-semibold text-white mb-4">Permanent Address</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <div>{formData.permanentAddress.flatHouseNo}, {formData.permanentAddress.street}</div>
            <div>PO: {formData.permanentAddress.po}, PS: {formData.permanentAddress.ps}</div>
            <div>{formData.permanentAddress.district}, {formData.permanentAddress.state}</div>
            <div>PIN: {formData.permanentAddress.pinCode}</div>
          </div>
        </Card>
      </div>
      
      <Card className="p-6 glass-subtle">
        <h3 className="text-lg font-semibold text-white mb-4">Local Address</h3>
        <div className="text-sm text-gray-300">
          <div>{formData.localAddress.flatHouseNo}, {formData.localAddress.street}</div>
          <div>PO: {formData.localAddress.po}, PS: {formData.localAddress.ps}</div>
          <div>{formData.localAddress.district}, {formData.localAddress.state}</div>
          <div>PIN: {formData.localAddress.pinCode}</div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="responsive-container section-spacing">
      <div className={`text-center mb-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <h1 className="heading-responsive text-gradient-blue mb-4">
          Create Your Account
        </h1>
        <p className="text-responsive-base text-gray-300 max-w-2xl mx-auto">
          Join thousands of students on their journey to success in technology
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="p-6 sm:p-8 lg:p-12 glass-enhanced">
          {renderStepIndicator()}
          
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderPersonalInfo()}
            {currentStep === 2 && renderAddressForm('permanentAddress', 'Permanent Address')}
            {currentStep === 3 && renderAddressForm('localAddress', 'Local Address')}
            {currentStep === 4 && renderReview()}

            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-600 space-y-4 sm:space-y-0">
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={prevStep}
                  className="btn-outline-responsive"
                >
                  Previous
                </Button>
              )}
              
              <div className="flex-1 flex justify-center sm:justify-end">
                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary-responsive hover-lift"
                    disabled={!validateStep(currentStep)}
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button 
                    type="button"
                    onClick={handleSubmit}
                    loading={loading || uploading} 
                    className="btn-primary-responsive hover-lift animate-pulse-glow"
                    disabled={loading || uploading}
                  >
                    {uploading ? 'Uploading Photo...' : 'Complete Registration'}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Card>

        {/* Login Link */}
        <div className={`text-center mt-8 ${isVisible ? 'animate-fade-in-up animate-delay-1000' : 'opacity-0'}`}>
          <Card className="p-4 glass-subtle inline-block">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-secondary hover:text-primary transition-colors duration-200 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;