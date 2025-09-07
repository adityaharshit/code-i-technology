import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/users.js';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import { User, Phone, MapPin, Save, Edit3 } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await usersAPI.getProfile();
        setProfile(response.data);
      } catch (error) {
        toast.error('Failed to fetch profile.');
        console.error('Failed to fetch profile:', error);
      } finally {
        setPageLoading(false);
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
      const { id, rollNumber, fullName, email, ...updateData } = profile;
      await usersAPI.updateProfile(updateData);
      toast.success('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in-up">
          <LoadingSpinner />
          <p className="text-gray-400 animate-pulse">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center glass-card animate-fade-in-up">
          <div className="text-gray-400 space-y-2">
            <User size={48} className="mx-auto text-gray-500" />
            <p className="text-lg">Could not load profile data.</p>
            <p className="text-sm">Please try refreshing the page.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4 animate-fade-in-down">
          <div className="relative inline-block">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-xl animate-pulse-glow">
              {profile.fullName?.charAt(0) || 'U'}
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white animate-fade-in-up animate-delay-200">
              My Profile
            </h1>
            <p className="text-gray-400 text-sm sm:text-base animate-fade-in-up animate-delay-300">
              Manage your personal information and preferences
            </p>
          </div>
        </div>

        <Card className="glass-card p-4 sm:p-6 lg:p-8 animate-fade-in-up animate-delay-400">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <User className="text-secondary" size={24} />
              <h2 className="text-xl sm:text-2xl font-bold text-white">Personal Information</h2>
            </div>
            <Button
              onClick={() => setEditMode(!editMode)}
              variant="outline"
              size="sm"
              className="self-start sm:self-auto"
            >
              <Edit3 size={16} className="mr-2" />
              {editMode ? 'Cancel' : 'Edit'}
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Basic Information */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold text-white border-b border-gray-700 pb-2 flex items-center">
                <User size={20} className="mr-2 text-secondary" />
                Basic Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="animate-fade-in-left animate-delay-500">
                  <Input 
                    label="Full Name" 
                    value={profile.fullName || ''} 
                    disabled 
                    className="bg-gray-800 border-gray-600"
                  />
                </div>
                <div className="animate-fade-in-up animate-delay-600">
                  <Input 
                    label="Email" 
                    value={profile.email || ''} 
                    disabled 
                    className="bg-gray-800 border-gray-600"
                  />
                </div>
                <div className="animate-fade-in-right animate-delay-700">
                  <Input 
                    label="Roll Number" 
                    value={profile.rollNumber || ''} 
                    disabled 
                    className="bg-gray-800 border-gray-600"
                  />
                </div>
                <div className="animate-fade-in-left animate-delay-800">
                  <Input
                    label="Father's Name"
                    name="fatherName"
                    value={profile.fatherName || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={editMode ? 'hover-glow' : 'bg-gray-800 border-gray-600'}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold text-white border-b border-gray-700 pb-2 flex items-center">
                <Phone size={20} className="mr-2 text-secondary" />
                Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="animate-fade-in-left animate-delay-900">
                  <Input
                    label="Student Mobile"
                    name="studentMobile"
                    value={profile.studentMobile || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                    placeholder="Enter your mobile number"
                    className={editMode ? 'hover-glow' : 'bg-gray-800 border-gray-600'}
                  />
                </div>
                <div className="animate-fade-in-right animate-delay-1000">
                  <Input
                    label="Parent Mobile"
                    name="parentMobile"
                    value={profile.parentMobile || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                    placeholder="Enter parent's mobile number"
                    className={editMode ? 'hover-glow' : 'bg-gray-800 border-gray-600'}
                  />
                </div>
              </div>
            </div>
            
            {/* Address Information */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold text-white border-b border-gray-700 pb-2 flex items-center">
                <MapPin size={20} className="mr-2 text-secondary" />
                Permanent Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                <div className="animate-fade-in-up animate-delay-500">
                  <Input 
                    label="Flat/House No" 
                    name="flatHouseNo" 
                    value={profile.permanentAddress?.flatHouseNo || ''} 
                    onChange={(e) => handleAddressChange(e, 'permanentAddress')}
                    disabled={!editMode}
                    placeholder="Enter flat/house number"
                    className={editMode ? 'hover-glow' : 'bg-gray-800 border-gray-600'}
                  />
                </div>
                <div className="animate-fade-in-up animate-delay-600">
                  <Input 
                    label="Street" 
                    name="street" 
                    value={profile.permanentAddress?.street || ''} 
                    onChange={(e) => handleAddressChange(e, 'permanentAddress')}
                    disabled={!editMode}
                    placeholder="Enter street name"
                    className={editMode ? 'hover-glow' : 'bg-gray-800 border-gray-600'}
                  />
                </div>
                <div className="animate-fade-in-up animate-delay-700">
                  <Input 
                    label="PO" 
                    name="po" 
                    value={profile.permanentAddress?.po || ''} 
                    onChange={(e) => handleAddressChange(e, 'permanentAddress')}
                    disabled={!editMode}
                    placeholder="Post Office"
                    className={editMode ? 'hover-glow' : 'bg-gray-800 border-gray-600'}
                  />
                </div>
                <div className="animate-fade-in-up animate-delay-800">
                  <Input 
                    label="PS" 
                    name="ps" 
                    value={profile.permanentAddress?.ps || ''} 
                    onChange={(e) => handleAddressChange(e, 'permanentAddress')}
                    disabled={!editMode}
                    placeholder="Police Station"
                    className={editMode ? 'hover-glow' : 'bg-gray-800 border-gray-600'}
                  />
                </div>
                <div className="animate-fade-in-up animate-delay-900">
                  <Input 
                    label="District" 
                    name="district" 
                    value={profile.permanentAddress?.district || ''} 
                    onChange={(e) => handleAddressChange(e, 'permanentAddress')}
                    disabled={!editMode}
                    placeholder="Enter district"
                    className={editMode ? 'hover-glow' : 'bg-gray-800 border-gray-600'}
                  />
                </div>
                <div className="animate-fade-in-up animate-delay-1000">
                  <Input 
                    label="State" 
                    name="state" 
                    value={profile.permanentAddress?.state || ''} 
                    onChange={(e) => handleAddressChange(e, 'permanentAddress')}
                    disabled={!editMode}
                    placeholder="Enter state"
                    className={editMode ? 'hover-glow' : 'bg-gray-800 border-gray-600'}
                  />
                </div>
                <div className="animate-fade-in-up animate-delay-1100">
                  <Input 
                    label="Pincode" 
                    name="pincode" 
                    value={profile.permanentAddress?.pincode || ''} 
                    onChange={(e) => handleAddressChange(e, 'permanentAddress')}
                    disabled={!editMode}
                    placeholder="Enter pincode"
                    className={editMode ? 'hover-glow' : 'bg-gray-800 border-gray-600'}
                  />
                </div>
              </div>
            </div>
            
            {editMode && (
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-700 animate-fade-in-up">
                <Button 
                  type="submit" 
                  loading={loading} 
                  className="flex-1 sm:flex-initial btn-hover-lift"
                  size="lg"
                >
                  <Save size={18} className="mr-2" />
                  Update Profile
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setEditMode(false)}
                  className="flex-1 sm:flex-initial"
                  size="lg"
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </Card>

        
      </div>
    </div>
  );
};

export default Profile;