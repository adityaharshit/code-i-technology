import React, { useEffect, useState } from "react";
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';
import  {verifyCertificateAPI} from '../services/verifyCertificate.js';

const CertificateVerification = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [certificateNumber, setCertificateNumber] = useState('');
    const [certificateData, setCertificateData] = useState(null);

    const formatDate = (dateStr) =>
            new Date(dateStr).toLocaleDateString("en-GB");

    const handleChange = async(e) =>{
        setCertificateNumber(e.target.value);
    }

    const handleSubmit = async () =>{
        try{
            if(certificateNumber.trim() === ''){
                toast.error("Certificate number should not be empty");
                return;
            }

            setIsSubmitting(true);

            const response = await verifyCertificateAPI.getCertificateInfo(certificateNumber);
            setCertificateData(response.data);
            if(response.data.failedMessage){
                toast.error("Invalid certificate number");
                return
            }else{
                toast.success("Certificate verified!");
            }
            console.log(response.data);
        }catch(error){
            console.error("Failed to fetch certificate data", error);
            toast.error("Could not load certificate data");
        }finally{
            setIsSubmitting(false);
        }
    }
    return (
        <div className="min-h-screen py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Hero Section */}
            <div className={`text-center mb-12 lg:mb-16`} >
                <h1 className="heading-responsive text-gradient-blue mb-4 lg:mb-6">
                    Certificate Verification
                </h1>
                <p className="text-responsive-base text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    Enter the Certificate number to verify the authenticity of the certificate.
                </p>
            </div>

            {/* Contact Form */}
        <Card className={`p-6 sm:p-8 glass-enhanced hover-lift ${isVisible ? 'animate-fade-in-left animate-delay-400' : 'opacity-0'}`}>
        
        
          
            <Input
              label="Certificate Number"
              name="name"
              type="text"
              value={certificateNumber}
              onChange={handleChange}
              placeholder="Enter the certificate number"
              required
            />
            
            <Button
              type="submit"
              loading={isSubmitting}
              onClick = {handleSubmit}
              className="w-full hover-lift animate-pulse-glow mt-5"
            >
              {isSubmitting ? 'verifying...' : 'Verify'}
            </Button>
        </Card>

        <Card className={`p-6 sm:p-8 glass-enhanced hover-lift mt-5 ${isVisible ? 'animate-fade-in-left animate-delay-400' : 'opacity-0'}`}>
          
          {(certificateData && !certificateData.failedMessage) ? (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                    label="Certificate Number"
                    name="name"
                    type="text"
                    value={certificateData.certificateNumber}
                    onChange={handleChange}
                    placeholder="Enter the certificate number"
                    disabled
                    required
                    />
                    <Input
                    label="Student Name"
                    name="studentName"
                    type="text"
                    value={certificateData.studentName}
                    onChange={handleChange}
                    placeholder="Enter the certificate number"
                    disabled
                    required
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Input
                    label="Course Name"
                    name="courseName"
                    type="text"
                    value={certificateData.courseName}
                    onChange={handleChange}
                    placeholder="Enter the certificate number"
                    disabled
                    required
                    />
                    <Input
                    label="Course from"
                    name="startDate"
                    type="date"
                    value={formatDate(certificateData.startDate)}
                    onChange={handleChange}
                    placeholder="Enter the certificate number"
                    disabled
                    required
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Input
                    label="Course To"
                    name="endDate"
                    type="date"
                    value={formatDate(certificateData.endDate)}
                    onChange={handleChange}
                    placeholder="Enter the certificate number"
                    disabled
                    required
                    />
                    <Input
                    label="Date of Issue"
                    name="issueDate"
                    type="date"
                    value={formatDate(certificateData.issueDate)}
                    onChange={handleChange}
                    placeholder="Enter the certificate number"
                    disabled
                    required
                    />
                </div>
                {(certificateData.courseType === 3) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Input
                    label="Typing speed(English)"
                    name="speedEnglish"
                    type="number"
                    value={certificateData.speedEnglish}
                    onChange={handleChange}
                    placeholder="Enter the certificate number"
                    disabled
                    required
                    />
                    <Input
                    label="Typing speed(Hindi)"
                    name="speedHindi"
                    type="number"
                    value={certificateData.speedHindi}
                    onChange={handleChange}
                    placeholder="Enter the certificate number"
                    disabled
                    required
                    />
                </div>
                )}
            
            </>
          ) : (
            <p className="text-responsive-base text-gray-300 max-w-3xl mx-auto leading-relaxed">
                No certificate data to display. Please enter a valid certificate number and click Verify.
            </p>
          )}
        </Card>
        </div>
    );
};

export default CertificateVerification;
