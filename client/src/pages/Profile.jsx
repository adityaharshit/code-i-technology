import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/users';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await usersAPI.getProfile();
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleAddressChange = (e, addressType) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [addressType]: {
        ...prev[addressType],
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await usersAPI.updateProfile(profile);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Full Name" value={profile.fullName || ''} disabled />
          <Input label="Email" value={profile.email || ''} disabled />
          <Input label="Roll Number" value={profile.rollNumber || ''} disabled />
          <Input
            label="Father's Name"
            name="fatherName"
            value={profile.fatherName || ''}
            onChange={handleChange}
          />
          <Input
            label="Student Mobile"
            name="studentMobile"
            value={profile.studentMobile || ''}
            onChange={handleChange}
          />
          <Input
            label="Parent Mobile"
            name="parentMobile"
            value={profile.parentMobile || ''}
            onChange={handleChange}
          />
        </div>
        
        <h2 className="text-2xl font-bold pt-6">Permanent Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Flat/House No" name="flatNo" value={profile.permanentAddress?.flatNo || ''} onChange={(e) => handleAddressChange(e, 'permanentAddress')} />
            <Input label="Street" name="street" value={profile.permanentAddress?.street || ''} onChange={(e) => handleAddressChange(e, 'permanentAddress')} />
            <Input label="PO" name="po" value={profile.permanentAddress?.po || ''} onChange={(e) => handleAddressChange(e, 'permanentAddress')} />
            <Input label="PS" name="ps" value={profile.permanentAddress?.ps || ''} onChange={(e) => handleAddressChange(e, 'permanentAddress')} />
            <Input label="District" name="district" value={profile.permanentAddress?.district || ''} onChange={(e) => handleAddressChange(e, 'permanentAddress')} />
            <Input label="State" name="state" value={profile.permanentAddress?.state || ''} onChange={(e) => handleAddressChange(e, 'permanentAddress')} />
            <Input label="Pincode" name="pincode" value={profile.permanentAddress?.pincode || ''} onChange={(e) => handleAddressChange(e, 'permanentAddress')} />
        </div>
        
        <Button type="submit" loading={loading} className="w-full">
          Update Profile
        </Button>
      </form>
    </Card>
  );
};

export default Profile;