import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  Users, 
  Star,
  X,
  BookOpen 
} from 'lucide-react';

const EnrollmentModal = ({ isOpen, onClose, onConfirm, course, loading }) => {
  if (!isOpen || !course) return null;

  const totalCost = course.feePerMonth * course.duration;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-full flex items-center justify-center transition-all duration-300 z-10"
          disabled={loading}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-6">
          {/* Header Icon */}
          <div className="relative mx-auto w-20 h-20">
            <div className="w-full h-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full flex items-center justify-center animate-pulse-glow">
              <AlertTriangle className="w-10 h-10 text-yellow-400" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-full animate-ping"></div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Confirm Enrollment</h2>
            <p className="text-gray-400">
              You're about to enroll in this course
            </p>
          </div>

          {/* Course Details Card */}
          <div className="bg-gradient-to-br from-dark-700/60 to-dark-600/40 border border-dark-600/50 rounded-xl p-6 text-left space-y-4">
            {/* Course Header */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-lg flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex-grow">
                <h3 className="font-bold text-white text-lg leading-tight">
                  {course.title}
                </h3>
                <div className="flex items-center space-x-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-xs text-gray-400 ml-1">(4.8)</span>
                </div>
              </div>
            </div>

            {/* Course Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-dark-600/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Duration</p>
                  <p className="text-sm font-semibold text-white">{course.duration} months</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Monthly Fee</p>
                  <p className="text-sm font-semibold text-white">₹{course.feePerMonth}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Students</p>
                  <p className="text-sm font-semibold text-white">1.2k+</p>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-dark-800/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Monthly Payment</span>
                <span className="text-white font-semibold">₹{course.feePerMonth}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Duration</span>
                <span className="text-white">{course.duration} months</span>
              </div>
              <div className="border-t border-dark-600/50 pt-2 flex justify-between">
                <span className="font-semibold text-white">Total Cost</span>
                <span className="font-bold text-secondary text-lg">₹{totalCost}</span>
              </div>
              <p className="text-xs text-gray-500 text-center pt-2">
                Pay monthly - cancel anytime
              </p>
            </div>
          </div>

          {/* Benefits List */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-4">
            <h4 className="font-semibold text-green-400 mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              What you'll get:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span>Lifetime access to content</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span>Certificate upon completion</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span>Community access</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span>Expert instructor support</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500/50 transition-all duration-300"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-secondary to-primary hover:from-primary hover:to-secondary transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-secondary/25 relative overflow-hidden group"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Enroll Now
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Button>
          </div>

          {/* Security Note */}
          <p className="text-xs text-gray-500 text-center">
            🔒 Secure enrollment - your payment details are protected
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default EnrollmentModal;