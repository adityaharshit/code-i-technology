import React, { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { useAuth } from '../../hooks/useAuth';
import { useUpload } from '../../hooks/useUpload';
import { validateRegistration } from '../../utils/validators';
import { GENDER_OPTIONS, BLOOD_GROUP_OPTIONS, QUALIFICATION_OPTIONS, OCCUPATION_OPTIONS } from '../../utils/constants';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { UserPlus, Upload, ArrowRight, ArrowLeft } from 'lucide-react';

const statesAndDistricts = {
  "West Bengal": ["Kolkata", "Howrah", "North 24 Parganas", "South 24 Parganas"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Puri", "Balasore"],
  "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur"]
};

const RegisterForm = ({ onRegisterSuccess }) => {
  const { register } = useAuth();
  const { uploadFile, uploading } = useUpload();
  const [step, setStep] = useState(1);
  const [photoPreview, setPhotoPreview] = useState(null);

  const initialValues = {
    fullName: '', email: '', username: '', password: '', photoUrl: '',
    fatherName: '', studentMobile: '', parentMobile: '', occupation: '', dob: '',
    collegeName: '', bloodGroup: '', gender: '', qualification: '',
    permanentAddress: { flatHouseNo: '', street: '', po: '', ps: '', district: '', state: '', pincode: '' },
    localAddress: { flatHouseNo: '', street: '', po: '', ps: '', district: '', state: '', pincode: '' },
    sameAsPermanent: false,
  };

  const { values, setValues, errors, isSubmitting, handleChange, handleSubmit } = useForm(initialValues, validateRegistration);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
      const url = await uploadFile(file, 'student-photos');
      if (url) {
        setValues(prev => ({ ...prev, photoUrl: url }));
      }
    }
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setValues(prev => ({
      ...prev,
      sameAsPermanent: checked,
      localAddress: checked ? { ...prev.permanentAddress } : initialValues.localAddress,
    }));
  };
  
  const handleAddressChange = (e, addressType) => {
      const { name, value } = e.target;
      setValues(prev => ({
          ...prev,
          [addressType]: {
              ...prev[addressType],
              [name]: value,
          }
      }))
  }

  const handleRegister = async () => {
      const submissionData = { ...values };
      delete submissionData.sameAsPermanent;
      await register(submissionData);
      onRegisterSuccess();
  };
  
  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <Card className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-2">Student Registration</h2>
      <p className="text-center text-gray-400 mb-8">Step {step} of 3</p>

      <form onSubmit={(e) => handleSubmit(e, handleRegister)}>
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            <Input name="fullName" label="Full Name" value={values.fullName} onChange={handleChange} error={errors.fullName} />
            <Input name="email" type="email" label="Email Address" value={values.email} onChange={handleChange} error={errors.email} />
            <Input name="username" label="Username" value={values.username} onChange={handleChange} error={errors.username} />
            <Input name="password" type="password" label="Password" value={values.password} onChange={handleChange} error={errors.password} />
            <Input name="fatherName" label="Father's Name" value={values.fatherName} onChange={handleChange} error={errors.fatherName} />
            <Input name="dob" type="date" label="Date of Birth" value={values.dob} onChange={handleChange} error={errors.dob} />
            <div className="flex items-center space-x-4">
              {photoPreview && <img src={photoPreview} alt="Preview" className="w-16 h-16 rounded-full object-cover"/>}
              <Input name="photo" type="file" label="Your Photo" onChange={handleFileChange} error={errors.photoUrl} helperText="Upload your profile picture."/>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <Input name="studentMobile" label="Student Mobile" value={values.studentMobile} onChange={handleChange} error={errors.studentMobile} />
              <Input name="parentMobile" label="Parent Mobile" value={values.parentMobile} onChange={handleChange} error={errors.parentMobile} />
              <Input as="select" name="occupation" label="Occupation" value={values.occupation} onChange={handleChange} error={errors.occupation} options={OCCUPATION_OPTIONS} />
              <Input as="select" name="qualification" label="Qualification" value={values.qualification} onChange={handleChange} error={errors.qualification} options={QUALIFICATION_OPTIONS} />
              <Input as="select" name="gender" label="Gender" value={values.gender} onChange={handleChange} error={errors.gender} options={GENDER_OPTIONS} />
              <Input as="select" name="bloodGroup" label="Blood Group" value={values.bloodGroup} onChange={handleChange} error={errors.bloodGroup} options={BLOOD_GROUP_OPTIONS} />
              <Input name="collegeName" label="College Name" value={values.collegeName} onChange={handleChange} error={errors.collegeName} className="md:col-span-2"/>
          </div>
        )}

        {step === 3 && (
            <div className="animate-fade-in space-y-8">
              {/* Permanent Address */}
              <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-700 p-4 rounded-lg">
                  <legend className="px-2 text-secondary font-semibold">Permanent Address</legend>
                  <Input name="flatHouseNo" label="Flat/House No" value={values.permanentAddress.flatHouseNo} onChange={(e) => handleAddressChange(e, 'permanentAddress')} />
                  <Input name="street" label="Street" value={values.permanentAddress.street} onChange={(e) => handleAddressChange(e, 'permanentAddress')} />
                  <Input name="po" label="Post Office" value={values.permanentAddress.po} onChange={(e) => handleAddressChange(e, 'permanentAddress')} />
                  <Input name="ps" label="Police Station" value={values.permanentAddress.ps} onChange={(e) => handleAddressChange(e, 'permanentAddress')} />
                  <Input as="select" name="state" label="State" value={values.permanentAddress.state} onChange={(e) => handleAddressChange(e, 'permanentAddress')} options={Object.keys(statesAndDistricts).map(s => ({value: s, label: s}))} />
                  <Input as="select" name="district" label="District" value={values.permanentAddress.district} onChange={(e) => handleAddressChange(e, 'permanentAddress')} options={statesAndDistricts[values.permanentAddress.state]?.map(d => ({value: d, label: d})) || []} />
                  <Input name="pincode" label="Pincode" value={values.permanentAddress.pincode} onChange={(e) => handleAddressChange(e, 'permanentAddress')} />
              </fieldset>
              
              {/* Local Address */}
              <div className="flex items-center">
                  <input type="checkbox" id="sameAsPermanent" name="sameAsPermanent" checked={values.sameAsPermanent} onChange={handleCheckboxChange} className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary"/>
                  <label htmlFor="sameAsPermanent" className="ml-2 block text-sm text-gray-300">Local address is same as permanent address</label>
              </div>

              {!values.sameAsPermanent && (
                  <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-700 p-4 rounded-lg">
                      <legend className="px-2 text-secondary font-semibold">Local Address</legend>
                      <Input name="flatHouseNo" label="Flat/House No" value={values.localAddress.flatHouseNo} onChange={(e) => handleAddressChange(e, 'localAddress')} />
                      <Input name="street" label="Street" value={values.localAddress.street} onChange={(e) => handleAddressChange(e, 'localAddress')} />
                      <Input name="po" label="Post Office" value={values.localAddress.po} onChange={(e) => handleAddressChange(e, 'localAddress')} />
                      <Input name="ps" label="Police Station" value={values.localAddress.ps} onChange={(e) => handleAddressChange(e, 'localAddress')} />
                      <Input as="select" name="state" label="State" value={values.localAddress.state} onChange={(e) => handleAddressChange(e, 'localAddress')} options={Object.keys(statesAndDistricts).map(s => ({value: s, label: s}))} />
                      <Input as="select" name="district" label="District" value={values.localAddress.district} onChange={(e) => handleAddressChange(e, 'localAddress')} options={statesAndDistricts[values.localAddress.state]?.map(d => ({value: d, label: d})) || []}/>
                      <Input name="pincode" label="Pincode" value={values.localAddress.pincode} onChange={(e) => handleAddressChange(e, 'localAddress')} />
                  </fieldset>
              )}
            </div>
        )}

        <div className="flex justify-between mt-8 pt-4 border-t border-gray-700">
            {step > 1 && <Button type="button" variant="outline" onClick={prevStep}><ArrowLeft size={16} className="mr-2"/> Previous</Button>}
            <div className="ml-auto">
              {step < 3 && <Button type="button" onClick={nextStep}>Next <ArrowRight size={16} className="ml-2"/></Button>}
              {step === 3 && <Button type="submit" loading={isSubmitting || uploading}><UserPlus size={16} className="mr-2"/> Register</Button>}
            </div>
        </div>
      </form>
    </Card>
  );
};

export default RegisterForm;
