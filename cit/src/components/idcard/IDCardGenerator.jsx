// Enhanced Futuristic ID Card Generator Component
import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import {
  CreditCard,
  Download,
  User,
  Calendar,
  Phone,
  Droplets,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import idCardFrontTemplate from '../../assets/id_card_front.jpg';
import idCardBackTemplate from '../../assets/id_card_back.jpg';

const IDCardGenerator = ({ isOpen, onClose, course, user }) => {
  const { refreshUser } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshUserData = async () => {
    setIsRefreshing(true);
    try {
      await refreshUser();
      toast.success('User data refreshed successfully!');
    } catch (error) {
      toast.error('Failed to refresh user data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const getExpiryDate = () => {
    if (course.startDate) {
      const startDate = new Date(course.startDate);
      const expiryDate = new Date(startDate);
      expiryDate.setMonth(startDate.getMonth() + course.duration);
      return expiryDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).replace(' ', ' ');
    }
    const fallbackDate = new Date();
    fallbackDate.setFullYear(fallbackDate.getFullYear() + 1);
    return fallbackDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).replace(' ', ' ');
  };

  const generateQRData = () => {
    const expiryDate = getExpiryDate();
    return JSON.stringify({
      name: user.fullName,
      course: course.title,
      dob: user.dob ? new Date(user.dob).toLocaleDateString('en-CA') : 'N/A',
      bloodGroup: user.bloodGroup || 'N/A',
      gender: user.gender || 'N/A',
      email: user.email || 'NA',
      studentId: user.rollNumber,
      contact: user.studentMobile || user.parentMobile || 'N/A',
      expiryDate: expiryDate,
    });
  };

  const loadImageAsBase64 = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = (err) => reject(new Error(`Failed to load image at ${src}. Error: ${JSON.stringify(err)}`));
      img.src = src;
    });
  };

  const generateIDCard = async () => {
    if (!user.photoUrl) {
      toast.error('Profile photo is required. Please upload one in your profile.');
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading('Generating ID Card...');

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [53.98, 85.6] // Standard ID card size: width, height
      });

      const cardWidth = 53.98;
      const cardHeight = 85.6;

      const [frontTemplate, backTemplate, userPhoto, qrCodeImage] = await Promise.all([
        loadImageAsBase64(idCardFrontTemplate).catch(e => { toast.error("Failed to load ID card front template."); throw e; }),
        loadImageAsBase64(idCardBackTemplate).catch(e => { toast.error("Failed to load ID card back template."); throw e; }),
        loadImageAsBase64(user.photoUrl).catch(e => { toast.error("Failed to load your profile photo."); throw e; }),
        QRCode.toDataURL(generateQRData(), { width: 200, margin: 1 }).catch(e => { toast.error("Failed to generate QR code."); throw e; }),
        
      ]);

      // FRONT SIDE
      pdf.addImage(frontTemplate, 'JPEG', 0, 0, cardWidth, cardHeight);
      
      // Photo
      pdf.addImage(userPhoto, 'PNG', 4.7, 7.7, 21, 22);

      // Logo
      // if (logoImage) {
      //   pdf.addImage(logoImage, 'PNG', 31, 14.5, 18, 4.5);
      // }

      // Student Name
      pdf.setTextColor('#000000');
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      const studentNameParts = user.fullName.split(' ');
      const firstName = studentNameParts[0];
      const lastName = studentNameParts.slice(1).join(' ');
      pdf.text(firstName, cardWidth / 2, 38, { align: 'center' });
      if (lastName) {
          pdf.text(lastName, cardWidth / 2, 42, { align: 'center' });
      }

      // "Student" text
      // pdf.setFontSize(8);
      // pdf.setTextColor('#EFAF1E');
      // pdf.text('Student', cardWidth / 2, 57, { align: 'center' });

      // Details
      pdf.setFontSize(6);
      pdf.setTextColor('#000000');
      pdf.setFont('helvetica', 'normal');
      pdf.text(user.gender || 'N/A', 27, 51.5);
      pdf.text(getExpiryDate(), 27, 54.5);
      pdf.text(user.studentMobile || user.parentMobile || 'N/A', 27, 58);
      pdf.text(user.bloodGroup || 'N/A', 27, 61);
      
      // QR Code
      pdf.addImage(qrCodeImage, 'PNG', 35.9, 63.5, 14, 16);
      
      // Roll Number
      pdf.setFontSize(9);
      pdf.setTextColor('#EFAF1E');
      pdf.setFont('helvetica', 'bold');
      pdf.text(user.rollNumber, 5, 82.5);

      // BACK SIDE
      pdf.addPage();
      pdf.addImage(backTemplate, 'JPEG', 0, 0, cardWidth, cardHeight);
      
      // Barcode text
      pdf.setFontSize(6);
      pdf.setTextColor('#000000');
      pdf.setFont('helvetica', 'normal');
      pdf.text(user.rollNumber, cardWidth / 2, 55.5, { align: 'center' });

      toast.success('ID Card Generated!', { id: toastId });
      const fileName = `${user.rollNumber}_IDCard.pdf`;
      pdf.save(fileName);
      onClose();

    } catch (error) {
      console.error('Error generating ID card:', error);
      toast.error(error.message || 'An unexpected error occurred.', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      <div className="relative pt-4">
        <div className="text-center space-y-6">
          <div className="relative mx-auto w-20 h-20">
            <div className="w-full h-full bg-gradient-to-br from-electric-400/20 to-cyber-500/20 rounded-full flex items-center justify-center animate-glow-pulse">
              <CreditCard className="w-10 h-10 text-electric-400" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-electric-400/10 to-cyber-500/10 rounded-full animate-ping"></div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-4">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">Generate ID Card</h2>
              <Button onClick={handleRefreshUserData} disabled={isRefreshing} variant="outline" size="sm" className="text-xs">
                {isRefreshing ? <LoadingSpinner size="sm"/> : <RefreshCw className="w-3 h-3" />}
              </Button>
            </div>
            <p className="text-gray-400">
              Create your student ID card for <span className="text-electric-400 font-semibold">{course.title}</span>
            </p>
          </div>

          <div className="bg-gradient-to-br from-dark-700/60 to-dark-600/40 border border-dark-600/50 rounded-xl p-6 text-left space-y-4">
            <h3 className="font-semibold text-white flex items-center">
              <User className="w-5 h-5 mr-2 text-electric-400" />
              Student Information Preview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem icon={User} label="Name" value={user.fullName} />
              <InfoItem icon={CreditCard} label="Student ID" value={user.rollNumber} mono />
              <InfoItem icon={Calendar} label="Expiry Date" value={getExpiryDate()} />
              <InfoItem icon={Phone} label="Contact" value={user.studentMobile || user.parentMobile || 'N/A'} />
              <InfoItem icon={Droplets} label="Blood Group" value={user.bloodGroup || 'N/A'} />
              <InfoItem icon={User} label="Gender" value={user.gender || 'N/A'} />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4">
            <h4 className="font-semibold text-blue-400 mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Requirements Check:
            </h4>
            <div className="space-y-2 text-sm">
              <RequirementCheck label="Profile Photo" valid={!!user.photoUrl} />
              <RequirementCheck label="Student ID" valid={!!user.rollNumber} value={user.rollNumber} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button variant="outline" onClick={onClose} disabled={isGenerating} className="flex-1">
              Cancel
            </Button>
            <Button onClick={generateIDCard} disabled={isGenerating || !user.photoUrl} className="flex-1 group">
              {isGenerating ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Generating...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Generate & Download
                </>
              )}
            </Button>
          </div>

          {!user.photoUrl && (
            <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <p className="text-red-400 text-xs">
                  Please upload a profile photo in your profile settings before generating an ID card.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

const InfoItem = ({ icon: Icon, label, value, mono = false }) => (
    <div className="flex items-center space-x-3">
        <Icon className="w-4 h-4 text-gray-400" />
        <div>
            <p className="text-xs text-gray-400">{label}</p>
            <p className={`text-white font-medium ${mono ? 'font-mono' : ''}`}>{value}</p>
        </div>
    </div>
);

const RequirementCheck = ({ label, valid, value = '' }) => (
    <div className="flex items-center justify-between">
        <span className="text-gray-300">{label}</span>
        {valid ? (
            <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className={`text-green-400 text-xs ${value ? 'font-mono' : ''}`}>{value || 'Ready'}</span>
            </div>
        ) : (
            <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-xs">Required</span>
            </div>
        )}
    </div>
);

export default IDCardGenerator;

