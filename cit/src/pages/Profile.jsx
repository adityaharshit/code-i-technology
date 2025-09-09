// Enhanced Futuristic Profile Page
import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/users.js';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import { 
  User, 
  Phone, 
  MapPin, 
  Save, 
  Edit3, 
  Mail, 
  Calendar, 
  Shield, 
  Settings, 
  Award, 
  Target, 
  Zap, 
  CheckCircle, 
  Camera,
  Sparkles,
  TrendingUp,
  Activity
} from 'lucide-react';

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
        <LoadingSpinner size="lg" text="Loading your profile..." />
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card variant="hologram" className="p-12 text-center animate-fade-in-up">
          <div className="space-y-6">
            <div className="relative">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-electric-500/20 to-cyber-500/20 rounded-2xl flex items-center justify-center animate-float">
                <User className="w-10 h-10 text-electric-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-2 h-2 bg-cyber-400 rounded-full animate-particle-float" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold bg-gradient-to-r from-electric-400 to-cyber-500 bg-clip-text text-transparent mb-2">
                Profile Not Found
              </h3>
              <p className="text-gray-300 mb-4">Could not load profile data.</p>
              <Button variant="primary" glow onClick={() => window.location.reload()}>
                <Shield className="w-4 h-4 mr-2" />
                Refresh Page
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <User className="absolute top-20 left-10 w-4 h-4 text-electric-500/20 animate-float" style={{ animationDelay: '0s' }} />
        <Settings className="absolute top-32 right-16 w-3 h-3 text-cyber-500/20 animate-particle-float" style={{ animationDelay: '2s' }} />
        <Award className="absolute bottom-32 left-20 w-5 h-5 text-matrix-500/20 animate-neural-pulse" style={{ animationDelay: '1s' }} />
        <Shield className="absolute bottom-20 right-12 w-4 h-4 text-neural-500/20 " style={{ animationDelay: '3s' }} />
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Enhanced Header Section */}
        <Card variant="hologram" className="p-6 sm:p-8 text-center animate-fade-in-down">
          <div className="flex flex-col items-center space-y-6">
            {/* Enhanced Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-electric-500 to-cyber-500 rounded-3xl flex items-center justify-center text-white text-3xl sm:text-4xl font-display font-bold shadow-glow">
                {profile.fullName?.charAt(0) || 'U'}
              </div>
              {/* Status indicator */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-matrix-500 rounded-2xl border-4 border-quantum-800 flex items-center justify-center group-hover:">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              {/* Floating particles around avatar */}
              <div className="absolute -top-2 -left-2 w-2 h-2 bg-electric-400 rounded-full animate-particle-float" />
              <div className="absolute -bottom-1 -left-3 w-1 h-1 bg-cyber-400 rounded-full animate-float" />
            </div>

            {/* Enhanced Title */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold bg-gradient-to-r from-electric-400 via-cyber-500 to-matrix-400 bg-clip-text text-transparent ">
                My Profile
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl">
                Manage your{' '}
                <span className="text-electric-400 font-semibold">personal information</span>{' '}
                and{' '}
                <span className="text-cyber-400 font-semibold">preferences</span>
              </p>
              
              
            </div>
          </div>
        </Card>

        {/* Enhanced Main Profile Card */}
        <Card variant="neural" className="p-6 sm:p-8 lg:p-10 animate-fade-in-up animate-delay-400 relative overflow-hidden">
          {/* Floating particles inside card */}
          <div className="absolute top-4 right-4 w-1 h-1 bg-electric-400 rounded-full animate-particle-float" />
          <div className="absolute bottom-6 left-6 w-2 h-2 bg-cyber-400 rounded-full animate-float" />
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0 relative z-10">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-electric-500/20 to-cyber-500/30 animate-neural-pulse">
                <User className="text-electric-400 w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-electric-400 to-cyber-500 bg-clip-text text-transparent">
                  Personal Information
                </h2>
                <p className="text-sm text-gray-400 mt-1">Keep your details up to date</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {editMode && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-matrix-500/20 border border-matrix-400/30 rounded-lg">
                  <Activity className="w-4 h-4 text-matrix-400 animate-pulse" />
                  <span className="text-xs text-matrix-300">Edit Mode</span>
                </div>
              )}
              <Button
                onClick={() => setEditMode(!editMode)}
                variant={editMode ? "outline" : "cyber"}
                size="sm"
                className="group"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {editMode ? 'Cancel' : 'Edit Profile'}
                {!editMode && <Sparkles className="w-3 h-3 ml-2 group-hover:" />}
              </Button>
            </div>
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