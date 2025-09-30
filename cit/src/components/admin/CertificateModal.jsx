// cit/src/components/admin/CertificateModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';
import { adminAPI } from '../../services/admin';
import { generateCertificatePDF } from '../../utils/certificateGeneratorUtil';
import toast from 'react-hot-toast';
import { Award, Download, Save } from 'lucide-react';

const CertificateModal = ({ isOpen, onClose, student, course }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchCertificateData = useCallback(async () => {
        if (!student || !course) return;
        setLoading(true);
        try {
            const response = await adminAPI.getCertificateInfo(student.id, course.id);
            setData(response.data);
            console.log(response.data);
        } catch (error) {
            toast.error("Failed to fetch certificate data.");
            onClose();
        } finally {
            setLoading(false);
        }
    }, [student, course, onClose]);

    useEffect(() => {
        if (isOpen) {
            fetchCertificateData();
        }
    }, [isOpen, fetchCertificateData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerate = async () => {
        setIsSaving(true);
        try {
            // First, save the (potentially edited) data to the database
            if(data.speedEnglish<0) {
                toast.error("Speed cannot be negative");
                setIsSaving(false);
                return;
            }
            if(data.speedHindi<0) {
                toast.error("Speed cannot be negative");
                setIsSaving(false);
                return;
            }
            await adminAPI.generateCertificate(student.id, course.id, data);
            
            // Then, generate the PDF with the saved data
            await generateCertificatePDF(data);
            
            onClose(); // Close modal on success
        } catch (error) {
            toast.error("Failed to save or generate certificate.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl">
            <div className="space-y-6">
                <div className="text-center">
                    <Award className="mx-auto h-12 w-12 text-secondary" />
                    <h2 className="text-2xl font-bold text-white mt-4">
                        {data?.isNew ? 'Generate Certificate' : 'Certificate Details'}
                    </h2>
                    <p className="text-gray-400">Review and confirm details before generating the PDF.</p>
                </div>

                {loading ? <LoadingSpinner /> : data && (
                    <div className="space-y-4">
                        <Input label="Certificate Number" value={data.certificateNumber} disabled />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Student Name" name="studentName" value={data.studentName} onChange={handleChange}  required/>
                            <Input label="Course Name" name="courseName" value={data.courseName} onChange={handleChange}  required/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Start Date" name="startDate" type="date" required value={new Date(data.startDate).toISOString().split('T')[0]} onChange={handleChange} />
                            <Input label="End Date" name="endDate" type="date" required value={new Date(data.endDate).toISOString().split('T')[0]} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <Input label="Instructor Name" name="instructorName" required value={data.instructorName} onChange={handleChange} />
                             <Input label="Issue Date" name="issueDate" type="date" required value={new Date(data.issueDate).toISOString().split('T')[0]} onChange={handleChange} />
                        </div>
                        { (parseInt(data.courseType) === 3) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <Input label="Typing speed(English)" type="number" name="speedEnglish" required value={data.speedEnglish} onChange={handleChange} />
                             <Input label="Typing speed(Hindi)" type="number" name="speedHindi" required value={data.speedHindi} onChange={handleChange} />
                        </div>
                        )}
                    </div>
                )}
                {}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                    <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
                    <Button onClick={handleGenerate} loading={isSaving} disabled={loading || !data.studentName || !data.courseName || !data.startDate || !data.endDate || !data.instructorName || !data.issueDate}>
                        <Download size={16} className="mr-2" />
                        Confirm & Generate
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default CertificateModal;