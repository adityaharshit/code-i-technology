// /cit/src/pages/admin/AddEditCourse.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { coursesAPI } from '../../services/courses';
import useUpload from '../../hooks/useUpload';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, BookOpen, Plus, Trash2, CheckCircle, Info, Tag, User, Briefcase, FileText } from 'lucide-react';

const defaultLearnings = [
  'Comprehensive understanding of core concepts',
  'Hands-on practical experience',
  'Industry-standard best practices',
  'Real-world project development',
  'Professional networking opportunities',
  'Career advancement strategies'
];

const defaultIncludes = [
  'Hours of content',
  'Downloadable resources',
  'Community access',
  'Certificate of completion'
];

const AddEditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { uploadFile, uploading } = useUpload();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [newItem, setNewItem] = useState({ learn: '', include: '' });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    startDate: '',
    feePerMonth: '',
    qrCodeUrl: '',
    discountPercentage: '10',
    whatYouWillLearn: defaultLearnings,
    courseIncludes: defaultIncludes,
    skillLevel: 'Beginner to Advanced',
    language: 'English',
    instructorName: 'John Doe',
    instructorDetails: 'Expert instructor with 10+ years of industry experience and a passion for teaching.',
    qrCodeFile: null,
  });

  useEffect(() => {
    if (id) {
      coursesAPI.getById(id)
        .then(response => {
          const data = response.data;
          setCourse(data);
          setFormData({
            title: data.title || '',
            description: data.description || '',
            duration: data.duration?.toString() || '',
            startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
            feePerMonth: data.feePerMonth?.toString() || '',
            qrCodeUrl: data.qrCodeUrl || '',
            discountPercentage: data.discountPercentage?.toString() || '10',
            whatYouWillLearn: data.whatYouWillLearn || defaultLearnings,
            courseIncludes: data.courseIncludes || defaultIncludes,
            skillLevel: data.skillLevel || 'Beginner to Advanced',
            language: data.language || 'English',
            instructorName: data.instructorName || 'John Doe',
            instructorDetails: data.instructorDetails || 'Expert instructor with 10+ years of industry experience...',
            qrCodeFile: null
          });
          setLoading(false);
        })
        .catch(() => {
          toast.error('Failed to load course data.');
          navigate('/admin-dashboard');
        });
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'qrCodeFile') {
      setFormData(prev => ({ ...prev, qrCodeFile: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddItem = (type) => {
    if (newItem[type].trim() === '') return;
    const list = type === 'learn' ? 'whatYouWillLearn' : 'courseIncludes';
    setFormData(prev => ({ ...prev, [list]: [...prev[list], newItem[type]] }));
    setNewItem(prev => ({ ...prev, [type]: '' }));
  };

  const handleRemoveItem = (type, index) => {
    const list = type === 'learn' ? 'whatYouWillLearn' : 'courseIncludes';
    setFormData(prev => ({ ...prev, [list]: prev[list].filter((_, i) => i !== index) }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let submissionData = { ...formData };

      if (submissionData.qrCodeFile) {
        const uploadedUrl = await uploadFile(submissionData.qrCodeFile, 'course-qrcodes');
        if (uploadedUrl) {
          submissionData.qrCodeUrl = uploadedUrl;
        } else {
          throw new Error('QR Code upload failed.');
        }
      }
      delete submissionData.qrCodeFile;

      // Stringify arrays for backend
      submissionData.whatYouWillLearn = JSON.stringify(submissionData.whatYouWillLearn);
      submissionData.courseIncludes = JSON.stringify(submissionData.courseIncludes);
      
      if (id) {
        await coursesAPI.update(id, submissionData);
        toast.success('Course updated successfully!');
      } else {
        await coursesAPI.create(submissionData);
        toast.success('Course created successfully!');
      }
      navigate('/admin-dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to save course.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) return <LoadingSpinner />;

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex justify-center items-center space-x-2 sm:space-x-4">
        {['Basic Info', 'Details', 'Instructor', 'Review'].map((title, index) => (
          <React.Fragment key={title}>
            <div className={`flex flex-col items-center ${step >= (index + 1) ? 'text-secondary' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                step >= (index + 1) ? 'border-secondary bg-secondary text-white' : 'border-gray-500'
              }`}>
                {step > (index + 1) ? '✓' : index + 1}
              </div>
              <div className="hidden sm:block text-center mt-2 text-xs font-medium">{title}</div>
            </div>
            {index < 3 && <div className={`w-8 sm:w-16 h-0.5 transition-colors duration-300 ${step > (index + 1) ? 'bg-secondary' : 'bg-gray-600'}`} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderDynamicList = (type, title, placeholder) => {
    const list = type === 'learn' ? formData.whatYouWillLearn : formData.courseIncludes;
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="flex gap-2">
          <Input 
            value={newItem[type]}
            onChange={(e) => setNewItem(prev => ({ ...prev, [type]: e.target.value }))}
            placeholder={placeholder}
            className="flex-grow"
          />
          <Button type="button" onClick={() => handleAddItem(type)}><Plus size={16} /></Button>
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {list.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-800 rounded-md">
              <span className="text-sm text-gray-300">{item}</span>
              <Button type="button" size="xs" variant="danger" onClick={() => handleRemoveItem(type, index)}><Trash2 size={14} /></Button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="max-w-4xl mx-auto p-6 sm:p-8 lg:p-12 glass-enhanced">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">{id ? 'Edit Course' : 'Create New Course'}</h1>
      {renderStepIndicator()}
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2"><FileText size={20}/> Basic Information</h2>
            <Input label="Title" name="title" value={formData.title} onChange={handleChange} required />
            <div>
              <label className="form-label-responsive">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="form-input-responsive w-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Duration (months)" name="duration" type="number" value={formData.duration} onChange={handleChange} required />
              <Input label="Fee per Month (INR)" name="feePerMonth" type="number" value={formData.feePerMonth} onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Start Date" name="startDate" type="date" value={formData.startDate} onChange={handleChange} />
              <Input label="Discount %" name="discountPercentage" type="number" value={formData.discountPercentage} onChange={handleChange} />
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
             <h2 className="text-xl font-bold text-secondary flex items-center gap-2"><Info size={20}/> Course Details</h2>
            {renderDynamicList('learn', "What You'll Learn", 'Add a learning outcome...')}
            {renderDynamicList('include', 'This Course Includes', 'Add an included feature...')}
          </div>
        )}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
             <h2 className="text-xl font-bold text-secondary flex items-center gap-2"><Briefcase size={20}/> Instructor & Meta</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Instructor Name" name="instructorName" value={formData.instructorName} onChange={handleChange} />
              <Input label="Skill Level" name="skillLevel" value={formData.skillLevel} onChange={handleChange} />
            </div>
            <div>
                <label className="form-label-responsive">Instructor Details</label>
                <textarea name="instructorDetails" value={formData.instructorDetails} onChange={handleChange} rows="3" className="form-input-responsive w-full" />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input label="Language" name="language" value={formData.language} onChange={handleChange} />
                 <Input label="QR Code URL (optional)" name="qrCodeUrl" value={formData.qrCodeUrl} onChange={handleChange} />
            </div>
            <div>
                <label className="form-label-responsive">Or Upload QR Code Image</label>
                <Input name="qrCodeFile" type="file" onChange={handleChange} accept="image/*" />
                {formData.qrCodeFile && <p className="text-xs text-green-400 mt-1">{formData.qrCodeFile.name} selected.</p>}
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
             <h2 className="text-xl font-bold text-secondary flex items-center gap-2"><CheckCircle size={20}/> Review & Submit</h2>
             <p className="text-gray-300">Please review all the information before submitting.</p>
             <div className="p-4 bg-gray-800 rounded-lg space-y-2">
                 <p><strong>Title:</strong> {formData.title}</p>
                 <p><strong>Duration:</strong> {formData.duration} months</p>
                 <p><strong>Fee:</strong> ₹{formData.feePerMonth}/month</p>
                 <p><strong>Instructor:</strong> {formData.instructorName}</p>
             </div>
          </div>
        )}
        <div className="flex justify-between mt-8 pt-4 border-t border-gray-700">
            {step > 1 && <Button type="button" variant="outline" onClick={prevStep}><ArrowLeft size={16} className="mr-2"/> Previous</Button>}
            <div className="ml-auto">
              {step < 4 && <Button type="button" onClick={nextStep}>Next <ArrowRight size={16} className="ml-2"/></Button>}
              {step === 4 && <Button type="submit" loading={isSubmitting || uploading}>{id ? 'Update Course' : 'Create Course'}</Button>}
            </div>
        </div>
      </form>
    </Card>
  );
};

export default AddEditCourse;
