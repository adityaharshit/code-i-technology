import React from 'react';
import Card from '../components/ui/Card';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
      <Card className="p-8">
        <p className="text-gray-300">
          Code i Technology is a leading institution dedicated to providing high-quality education in the field of computer science and technology. Our mission is to empower students with the skills and knowledge needed to succeed in the ever-evolving tech industry. We offer a wide range of courses, from beginner to advanced levels, taught by experienced instructors who are experts in their fields.
        </p>
      </Card>
    </div>
  );
};

export default About;