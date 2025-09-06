import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { formatCurrency, truncateText } from '../../utils/formatters';
import { Clock, Tag, Zap } from 'lucide-react';

const CourseCard = ({ course }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'live':
        return <span className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded animate-pulse">LIVE</span>;
      case 'upcoming':
        return <span className="absolute top-4 right-4 bg-blue-500 text-white px-2 py-1 text-xs font-bold rounded">UPCOMING</span>;
      default:
        return null;
    }
  };

  return (
    <Card className="p-0 flex flex-col h-full group overflow-hidden relative transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
      {getStatusBadge(course.status)}
      <div className="p-6 flex-grow">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-secondary transition-colors duration-300">
          {course.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 h-20">
          {truncateText(course.description, 120)}
        </p>
      </div>
      <div className="px-6 pb-6 mt-auto">
        <div className="flex justify-between items-center text-sm text-gray-400 mb-4 border-t border-gray-700 pt-4">
          <div className="flex items-center space-x-2">
            <Clock size={16} />
            <span>{course.duration} months</span>
          </div>
          <div className="flex items-center space-x-2">
            <Tag size={16} />
            <span className="font-semibold text-white">{formatCurrency(course.feePerMonth)}/mo</span>
          </div>
        </div>
        <Link to={`/courses/${course.id}`}>
          <Button className="w-full">
            View Details
            <Zap size={16} className="ml-2" />
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default CourseCard;
