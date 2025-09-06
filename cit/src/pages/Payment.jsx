import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { coursesAPI } from '../services/courses';
import { paymentsAPI } from '../services/payments';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { DISCOUNT_PERCENTAGE } from '../utils/constants';

const Payment = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [months, setMonths] = useState(1);
  const [paymentDetails, setPaymentDetails] = useState({
    totalFee: 0,
    discount: 0,
    netPayable: 0,
  });
  const [modeOfPayment, setModeOfPayment] = useState('online');
  const [paymentProof, setPaymentProof] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await coursesAPI.getById(courseId);
        setCourse(response.data);
      } catch (error) {
        console.error('Failed to fetch course details:', error);
      }
    };
    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    if (course) {
      const totalFee = course.feePerMonth * months;
      let discount = 0;
      if (months === course.duration) {
        discount = totalFee * (DISCOUNT_PERCENTAGE / 100);
      }
      const netPayable = totalFee - discount;
      setPaymentDetails({ totalFee, discount, netPayable });
    }
  }, [course, months]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('courseId', courseId);
    formData.append('months', months);
    formData.append('modeOfPayment', modeOfPayment);
    if (modeOfPayment === 'online' && paymentProof) {
      formData.append('paymentProof', paymentProof);
    }

    try {
      await paymentsAPI.create(formData);
      toast.success('Payment submitted for approval!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Payment for {course?.title}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Number of Months"
          type="number"
          value={months}
          onChange={(e) => setMonths(parseInt(e.target.value))}
          min="1"
          max={course?.duration}
        />

        <div>
          <p>Total Fee: ₹{paymentDetails.totalFee}</p>
          {paymentDetails.discount > 0 && <p>Discount: -₹{paymentDetails.discount}</p>}
          <p className="font-bold">Net Payable: ₹{paymentDetails.netPayable}</p>
        </div>

        <div>
          <label className="block mb-2">Mode of Payment</label>
          <select
            value={modeOfPayment}
            onChange={(e) => setModeOfPayment(e.target.value)}
            className="input-field"
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {modeOfPayment === 'online' && (
          <div>
            <img src={course?.qrCodeUrl} alt="QR Code" className="mx-auto mb-4" />
            <Input
              label="Payment Screenshot"
              type="file"
              onChange={(e) => setPaymentProof(e.target.files[0])}
            />
          </div>
        )}

        <Button type="submit" loading={loading} className="w-full">
          Submit
        </Button>
      </form>
    </Card>
  );
};

export default Payment;