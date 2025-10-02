// cit/src/components/admin/CertificateModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';
import { adminAPI } from '../../services/admin';
import { generateMarksheetPDF } from '../../utils/marksheetGeneratorUtil';
import toast from 'react-hot-toast';
import { Award, Download, Save } from 'lucide-react';

const MarksheetModal = ({ isOpen, onClose, student, course }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchMarksheetData = useCallback(async () => {
        if (!student || !course) return;
        setLoading(true);
        try {
            const response = await adminAPI.getMarksheetInfo(student.id, course.id);
            setData(response.data);
            
        } catch (error) {
            toast.error("Failed to fetch certificate data.");
            onClose();
        } finally {
            setLoading(false);
        }
    }, [student, course, onClose]);

    useEffect(() => {
        if (isOpen) {
            
            fetchMarksheetData();
        }
    }, [isOpen, fetchMarksheetData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerate = async () => {
        setIsSaving(true);
        try {
            // First, save the (potentially edited) data to the database
            if(data.cfMarks <0 || data.cfMarks > 200){
                toast.error("Computer Fundamental marks must be between 0 and 200.");
                setIsSaving(false);
                return;
            }
            if(data.photoshopMarks <0 || data.photoshopMarks > 200){
                toast.error("Photoshop marks must be between 0 and 200.");
                setIsSaving(false);
                return;
            }
            if(data.ihnMarks <0 || data.ihnMarks > 200){
                toast.error("Internet, Hardware marks must be between 0 and 200.");
                setIsSaving(false);
                return;
            }
            if(data.msOfficeMarks <0 || data.msOfficeMarks > 100){
                toast.error("Microsoft Office marks must be between 0 and 100.");
                setIsSaving(false);
                return;
            }
            if(data.tallyMarks <0 || data.tallyMarks > 100){
                toast.error("Tally marks must be between 0 and 100.");
                setIsSaving(false);
                return;
            }
            await adminAPI.generateMarksheet(student.id, course.id, data);
            
            // Then, generate the PDF with the saved data
            await generateMarksheetPDF(data);
            
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
                        {data?.isNew ? 'Generate Marksheet' : 'Marksheet Details'}
                    </h2>
                    <p className="text-gray-400">Review and confirm details before generating the PDF.</p>
                </div>

                {loading ? <LoadingSpinner /> : data && (
                    <div className="space-y-4">
                        <Input label="Marksheet Number" value={data.marksheetNumber} disabled />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Student Name" name="studentName" value={data.studentName} onChange={handleChange} />
                            <Input label="Date of Birth" name="dob" type="date" value={new Date(data.dob).toISOString().split('T')[0]} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <Input label="Computer Fundamental" type = "number" name="cfMarks" value={data.cfMarks} onChange={handleChange} />
                             <Input label="MS Office" type = "number" name="msOfficeMarks" value={data.msOfficeMarks} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <Input label="Tally" type = "number" name="tallyMarks" value={data.tallyMarks} onChange={handleChange} />
                             <Input label="Photoshop" type = "number" name="photoshopMarks" value={data.photoshopMarks} onChange={handleChange} />
                        </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Internet/Hardware" type = "number" name="ihnMarks" value={data.ihnMarks} onChange={handleChange} />
                                <Input label="Issue Date" name="issueDate" type="date" value={new Date(data.issueDate).toISOString().split('T')[0]} onChange={handleChange} />
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                    <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
                    <Button onClick={handleGenerate} loading={isSaving} disabled={loading || !data.studentName || !data.dob || !data.issueDate || [data.cfMarks, data.msOfficeMarks, data.tallyMarks, data.photoshopMarks, data.ihnMarks].some(mark => mark === '' || mark === null || isNaN(mark)) } >
                        <Download size={16} className="mr-2" />
                        Confirm & Generate
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default MarksheetModal;