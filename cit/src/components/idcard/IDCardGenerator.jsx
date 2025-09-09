// Enhanced Futuristic ID Card Generator Component
import React, { useState, useRef } from 'react';
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
  X,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const IDCardGenerator = ({ isOpen, onClose, course, user }) => {
  const { refreshUser } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const canvasRef = useRef(null);

  // Debug user data
  React.useEffect(() => {
    if (isOpen && user) {
      console.log('ID Card Generator - User Data:', {
        rollNumber: user.rollNumber,
        fullName: user.fullName,
        photoUrl: user.photoUrl,
        gender: user.gender,
        bloodGroup: user.bloodGroup,
        studentMobile: user.studentMobile,
        parentMobile: user.parentMobile,
        type: user.type
      });
    }
  }, [isOpen, user]);

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

  // Calculate expiry date based on course end date
  const getExpiryDate = () => {
    if (course.startDate) {
      const startDate = new Date(course.startDate);
      const expiryDate = new Date(startDate);
      expiryDate.setMonth(startDate.getMonth() + course.duration);
      return expiryDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    // Fallback: 1 year from now
    const fallbackDate = new Date();
    fallbackDate.setFullYear(fallbackDate.getFullYear() + 1);
    return fallbackDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Generate QR code data
  const generateQRData = () => {
    return JSON.stringify({
      studentId: user.rollNumber,
      name: user.fullName,
      bloodGroup: user.bloodGroup || 'N/A',
      contact: user.studentMobile || user.parentMobile || 'N/A',
      expiry: getExpiryDate(),
      course: course.title
    });
  };

  // Load image as base64
  const loadImageAsBase64 = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      
      // Handle different URL formats
      if (src.startsWith('http') || src.startsWith('data:')) {
        img.src = src;
      } else {
        // For relative paths, try to construct the full URL
        img.src = new URL(src, window.location.origin).href;
      }
    });
  };

  // Generate ID card PDF
  const generateIDCard = async () => {
    if (!user.photoUrl) {
      toast.error('Profile photo is required to generate ID card. Please upload a photo in your profile.');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Create PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [85.6, 53.98] // Standard ID card size
      });

      // Colors
      const darkBlue = '#1a2332';
      const yellow = '#f1c40f';
      const white = '#ffffff';
      const lightGray = '#f8f9fa';

      // Generate QR code
      const qrCodeData = generateQRData();
      const qrCodeDataURL = await QRCode.toDataURL(qrCodeData, {
        width: 200,
        margin: 1,
        color: {
          dark: darkBlue,
          light: white
        }
      });

      // Load logo
      let logoBase64;
      try {
        // Try different logo paths
        const logoPaths = [
          '/src/images/logo.png',
          './src/images/logo.png',
          '../images/logo.png',
          '/images/logo.png'
        ];
        
        let logoLoaded = false;
        for (const path of logoPaths) {
          try {
            logoBase64 = await loadImageAsBase64(path);
            logoLoaded = true;
            break;
          } catch (e) {
            continue;
          }
        }
        
        if (!logoLoaded) {
          logoBase64 = null;
        }
      } catch (error) {
        console.warn('Could not load logo, using placeholder');
        logoBase64 = null;
      }

      // Load user photo
      let photoBase64;
      try {
        photoBase64 = await loadImageAsBase64(user.photoUrl);
      } catch (error) {
        console.error('Error loading user photo:', error);
        toast.error('Failed to load profile photo. Please check your profile photo and try again.');
        setIsGenerating(false);
        return;
      }

      // FRONT SIDE
      // Background
      pdf.setFillColor(darkBlue);
      pdf.rect(0, 0, 85.6, 53.98, 'F');

      // Yellow curved design
      pdf.setFillColor(yellow);
      // Top curve
      pdf.ellipse(85.6, -10, 30, 20, 'F');
      // Bottom curve
      pdf.ellipse(0, 63.98, 30, 20, 'F');

      // White section
      pdf.setFillColor(white);
      pdf.rect(5, 8, 75.6, 37.98, 'F');

      // Logo area (if available)
      if (logoBase64) {
        try {
          pdf.addImage(logoBase64, 'PNG', 50, 10, 30, 8);
        } catch (error) {
          console.warn('Error adding logo to PDF, using text fallback');
          // Fallback text logo
          pdf.setFontSize(10);
          pdf.setTextColor(darkBlue);
          pdf.setFont('helvetica', 'bold');
          pdf.text('CODE i TECHNOLOGY', 52, 14);
        }
      } else {
        // Fallback text logo with better styling
        pdf.setFillColor(darkBlue);
        pdf.rect(50, 10, 30, 8, 'F');
        pdf.setFontSize(8);
        pdf.setTextColor(white);
        pdf.setFont('helvetica', 'bold');
        pdf.text('CODE i', 52, 14);
        pdf.text('TECHNOLOGY', 52, 17);
      }

      // Student photo
      try {
        // Determine image format from base64 string
        const imageFormat = photoBase64.includes('data:image/png') ? 'PNG' : 'JPEG';
        pdf.addImage(photoBase64, imageFormat, 7, 12, 20, 25);
      } catch (error) {
        console.error('Error adding photo to PDF:', error);
        // Add placeholder rectangle for photo
        pdf.setFillColor(200, 200, 200);
        pdf.rect(7, 12, 20, 25, 'F');
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text('Photo', 15, 26);
      }

      // Student name
      pdf.setFontSize(14);
      pdf.setTextColor(darkBlue);
      pdf.setFont('helvetica', 'bold');
      const nameLines = pdf.splitTextToSize(user.fullName, 45);
      pdf.text(nameLines, 30, 25);

      // Student role
      pdf.setFontSize(10);
      pdf.setTextColor(yellow);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Student', 30, 32);

      // Details section
      pdf.setFontSize(8);
      pdf.setTextColor(darkBlue);
      pdf.setFont('helvetica', 'normal');
      
      const details = [
        { label: 'Gender:', value: user.gender || 'N/A' },
        { label: 'Expiry Date:', value: getExpiryDate() },
        { label: 'Contact No:', value: user.studentMobile || user.parentMobile || 'N/A' },
        { label: 'Blood Group:', value: user.bloodGroup || 'N/A' }
      ];

      let yPos = 40;
      details.forEach(detail => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(detail.label, 7, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.text(detail.value, 25, yPos);
        yPos += 3;
      });

      // QR Code
      pdf.addImage(qrCodeDataURL, 'PNG', 65, 35, 15, 15);

      // Student ID
      pdf.setFontSize(12);
      pdf.setTextColor(yellow);
      pdf.setFont('helvetica', 'bold');
      pdf.text(user.rollNumber, 7, 52);

      // Add new page for back side
      pdf.addPage();

      // BACK SIDE
      // Background
      pdf.setFillColor(darkBlue);
      pdf.rect(0, 0, 85.6, 53.98, 'F');

      // Yellow curved design
      pdf.setFillColor(yellow);
      pdf.ellipse(85.6, -10, 30, 20, 'F');
      pdf.ellipse(0, 63.98, 30, 20, 'F');

      // Terms & Conditions
      pdf.setFontSize(12);
      pdf.setTextColor(yellow);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Terms & Conditions', 10, 15);

      pdf.setFontSize(8);
      pdf.setTextColor(white);
      pdf.setFont('helvetica', 'normal');
      const termsText = "I'd is mandatory for all students.\nWithout i'd card, entry is not\nacceptable in classroom.";
      pdf.text(termsText, 10, 22);

      // Signature section
      pdf.setFontSize(8);
      pdf.setTextColor(white);
      pdf.text('Signature Authority', 55, 35);
      pdf.text('Director', 70, 38);

      // Barcode (using student ID as barcode)
      pdf.setFillColor(darkBlue);
      // Simple barcode representation
      let barcodeX = 15;
      for (let i = 0; i < user.rollNumber.length; i++) {
        const charCode = user.rollNumber.charCodeAt(i);
        const barWidth = (charCode % 3) + 1;
        pdf.rect(barcodeX, 42, barWidth * 0.3, 4, 'F');
        barcodeX += barWidth * 0.5;
      }

      pdf.setFontSize(8);
      pdf.setTextColor(darkBlue);
      pdf.text(user.rollNumber, 25, 48);

      // Institute details
      pdf.setFontSize(7);
      pdf.setTextColor(darkBlue);
      const instituteDetails = [
        'Code i Technology, Aman and Akash',
        'Complex, 1st Floor, Sinha College More,',
        'Aurangabad Bihar-824101',
        'infocodeitechnology@gmail.com',
        '+91-7004554075'
      ];

      let detailY = 20;
      instituteDetails.forEach(detail => {
        pdf.text(detail, 10, detailY);
        detailY += 3;
      });

      // Save the PDF
      const fileName = `${user.rollNumber}_${course.title.replace(/\s+/g, '_')}_IDCard.pdf`;
      pdf.save(fileName);

      toast.success('ID Card generated and downloaded successfully!');
      onClose();

    } catch (error) {
      console.error('Error generating ID card:', error);
      toast.error('Failed to generate ID card. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      <div className="relative pt-4">

        <div className="text-center space-y-6">
          {/* Header Icon */}
          <div className="relative mx-auto w-20 h-20">
            <div className="w-full h-full bg-gradient-to-br from-electric-400/20 to-cyber-500/20 rounded-full flex items-center justify-center animate-glow-pulse">
              <CreditCard className="w-10 h-10 text-electric-400" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-electric-400/10 to-cyber-500/10 rounded-full animate-ping"></div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-4">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">Generate ID Card</h2>
              <Button
                onClick={handleRefreshUserData}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                {isRefreshing ? (
                  <LoadingSpinner className="w-3 h-3" />
                ) : (
                  <RefreshCw className="w-3 h-3" />
                )}
              </Button>
            </div>
            <p className="text-gray-400">
              Create your student ID card for <span className="text-electric-400 font-semibold">{course.title}</span>
            </p>
          </div>

          {/* Student Info Preview */}
          <div className="bg-gradient-to-br from-dark-700/60 to-dark-600/40 border border-dark-600/50 rounded-xl p-6 text-left space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center">
                <User className="w-5 h-5 mr-2 text-electric-400" />
                Student Information
              </h3>
              {user.photoUrl && (
                <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-electric-400/30">
                  <img 
                    src={user.photoUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Name</p>
                    <p className="text-white font-medium">{user.fullName}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Student ID</p>
                    <p className="text-white font-medium font-mono">{user.rollNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Expiry Date</p>
                    <p className="text-white font-medium">{getExpiryDate()}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Contact</p>
                    <p className="text-white font-medium">{user.studentMobile || user.parentMobile || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Droplets className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Blood Group</p>
                    <p className="text-white font-medium">{user.bloodGroup || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Gender</p>
                    <p className="text-white font-medium">{user.gender || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Debug Information (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gradient-to-br from-gray-500/10 to-gray-600/5 border border-gray-500/20 rounded-xl p-4">
              <h4 className="font-semibold text-gray-400 mb-3 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Debug - Raw User Data:
              </h4>
              <pre className="text-xs text-gray-300 bg-gray-800/50 p-2 rounded overflow-x-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          )}

          {/* Requirements Check */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4">
            <h4 className="font-semibold text-blue-400 mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Requirements Check:
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Profile Photo</span>
                {user.photoUrl ? (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-xs">Ready</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-xs">Required</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Student ID</span>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-xs font-mono">{user.rollNumber}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Course Enrollment</span>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-xs">Verified</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Contact Information</span>
                {user.studentMobile || user.parentMobile ? (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-xs">Available</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 text-xs">Optional</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isGenerating}
              className="flex-1 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500/50"
            >
              Cancel
            </Button>
            
            <Button
              onClick={generateIDCard}
              disabled={isGenerating || !user.photoUrl}
              className="flex-1 bg-gradient-to-r from-electric-500 to-cyber-500 hover:from-cyber-500 hover:to-matrix-500 relative overflow-hidden group"
            >
              {isGenerating ? (
                <>
                  <LoadingSpinner className="w-4 h-4 mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Generate & Download
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Button>
          </div>

          {/* Info Notes */}
          <div className="space-y-3">
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <p className="text-yellow-400 text-xs">
                  Your ID card will be downloaded as a PDF file with both front and back sides.
                </p>
              </div>
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
            
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <p className="text-green-400 text-xs">
                  ID card expires on {getExpiryDate()} based on your course duration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default IDCardGenerator;