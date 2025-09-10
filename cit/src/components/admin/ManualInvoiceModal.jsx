// /cit/src/components/admin/ManualInvoiceModal.jsx
import React, { useState, useMemo } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { adminAPI } from '../../services/admin';
import { useToast } from '../../contexts/ToastContext';
import { FilePlus } from 'lucide-react';

const ManualInvoiceModal = ({ isOpen, onClose, onSuccess }) => {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    studentMobile: '',
    studentAddress: '',
    courseName: '',
    courseFee: '',
    discount: '0',
    modeOfPayment: 'cash',
    amountPaid: '',
  });

  const netPayable = useMemo(() => {
    const courseFee = parseFloat(formData.courseFee) || 0;
    const discount = parseFloat(formData.discount) || 0;
    return courseFee - discount;
  }, [formData.courseFee, formData.discount]);

  // Update amountPaid when netPayable changes
  React.useEffect(() => {
    if (netPayable > 0 && formData.courseFee && formData.discount !== '') {
      setFormData(prev => ({ ...prev, amountPaid: netPayable.toString() }));
    }
  }, [netPayable, formData.courseFee, formData.discount]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const resetForm = () => {
    setFormData({
        studentId: '',
        studentName: '',
        studentMobile: '',
        studentAddress: '',
        courseName: '',
        courseFee: '',
        discount: '0',
        modeOfPayment: 'cash',
        amountPaid: '',
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submissionData = { ...formData, netPayable };
      const response = await adminAPI.generateManualInvoice(submissionData);
      const invoiceHTML = response.data;
      
      const printWindow = window.open('', '_blank');
      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
      printWindow.focus();
      
      showSuccess('Invoice generated successfully!');
      resetForm();
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to generate invoice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal key="manual-invoice-modal" isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-6 text-white">Create Manual Invoice</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Student ID" name="studentId" value={formData.studentId} onChange={handleChange} placeholder="e.g., 2024CIT5001" required />
            <Input label="Student Name" name="studentName" value={formData.studentName} onChange={handleChange} placeholder="Enter full name" required />
        </div>
        <Input label="Mobile Number" name="studentMobile" value={formData.studentMobile} onChange={handleChange} placeholder="Enter 10-digit mobile" required />
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
            <textarea name="studentAddress" value={formData.studentAddress} onChange={handleChange} rows="3" className="input-field w-full" placeholder="Enter full address" required />
        </div>
        <Input label="Course Name" name="courseName" value={formData.courseName} onChange={handleChange} placeholder="e.g., Full Stack Web Development" required />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Course Fee (INR)" name="courseFee" type="number" value={formData.courseFee} onChange={handleChange} min="0" required />
            <Input label="Discount (INR)" name="discount" type="number" value={formData.discount} onChange={handleChange} min="0" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Mode of Payment</label>
                <select name="modeOfPayment" value={formData.modeOfPayment} onChange={handleChange} required className="input-field w-full">
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                </select>
            </div>
            <Input label="Amount Paid (INR)" name="amountPaid" type="number" value={formData.amountPaid} onChange={handleChange} min="0" required />
        </div>
        
        <div className="p-4 bg-gray-800 rounded-lg mt-4 space-y-2">
            <div className="flex justify-between font-bold text-lg">
                <span className="text-secondary">Net Amount Payable:</span>
                <span className="text-secondary">₹{netPayable.toFixed(2)}</span>
            </div>
        </div>

        <div className="flex justify-end pt-4 gap-3">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>
            <FilePlus size={16} className="mr-2"/> Generate Invoice
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ManualInvoiceModal;

