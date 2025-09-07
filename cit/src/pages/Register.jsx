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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
      <div className="flex justify-center items-center space-x-2 sm:space-x-4 mb-6">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className={`flex flex-col items-center ${currentStep >= step.number ? 'text-secondary' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                currentStep >= step.number 
                  ? 'border-secondary bg-secondary text-white' 
                  : 'border-gray-500'
              }`}>
                {currentStep > step.number ? '✓' : step.number}
              </div>
              <div className="hidden sm:block text-center mt-2">
                <div className="text-xs font-medium">{step.title}</div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 sm:w-16 h-0.5 transition-colors duration-300 ${
                currentStep > step.number ? 'bg-secondary' : 'bg-gray-600'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className={`space-y-6 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
      <h2 className="subheading-responsive text-secondary border-b border-gray-600 pb-2">
        Personal Information
      </h2>
      
      <div className="form-grid-responsive">
        <Input
          label="Full Name *"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="form-input-responsive"
        />
        <Input
          label="Father's Name *"
          name="fatherName"
          value={formData.fatherName}
          onChange={handleChange}
          required
          className="form-input-responsive"
        />
      </div>

      <div className="form-grid-responsive">
        <Input
          label="Email *"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="form-input-responsive"
        />
        <div>
          <Input
            label="Username *"
            name="username"
            value={formData.username}
            onChange={handleChange}
            maxLength="20"
            required
            className="form-input-responsive"
          />
          {usernameStatus.loading && <p className="text-xs text-gray-400 mt-1">Checking...</p>}
          {usernameStatus.message && (
            <p className={`text-xs mt-1 ${usernameStatus.available ? 'text-green-400' : 'text-red-400'}`}>
              {usernameStatus.message}
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
                    type="submit" 
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