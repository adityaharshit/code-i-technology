# ID Card Generator Component

## Overview
The ID Card Generator component allows enrolled students to generate and download their student ID cards in PDF format. The ID card includes both front and back sides with all necessary student information.

## Features

### Front Side
- Student photo
- Full name
- Student ID (roll number)
- Gender
- Expiry date (based on course duration)
- Contact number
- Blood group
- QR code with student information
- Institute logo/branding

### Back Side
- Terms and conditions
- Institute contact information
- Barcode representation of student ID
- Director signature area

## Requirements

### Student Data Required
- Profile photo (mandatory)
- Full name
- Roll number/Student ID
- Course enrollment
- Contact number (optional)
- Blood group (optional)
- Gender (optional)

### Technical Dependencies
- `jspdf` - PDF generation
- `qrcode` - QR code generation
- React hooks for state management

## Usage

```jsx
import IDCardGenerator from '../components/idcard/IDCardGenerator';

// In your component
const [isIDCardModalOpen, setIsIDCardModalOpen] = useState(false);
const [selectedCourse, setSelectedCourse] = useState(null);

// Open modal
const handleGenerateIDCard = (course) => {
  setSelectedCourse(course);
  setIsIDCardModalOpen(true);
};

// Render component
<IDCardGenerator
  isOpen={isIDCardModalOpen}
  onClose={() => setIsIDCardModalOpen(false)}
  course={selectedCourse}
  user={currentUser}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | boolean | Yes | Controls modal visibility |
| `onClose` | function | Yes | Callback when modal is closed |
| `course` | object | Yes | Course information for ID card |
| `user` | object | Yes | Student information |

## Course Object Structure
```javascript
{
  id: number,
  title: string,
  duration: number, // in months
  startDate: string, // ISO date string
  // ... other course properties
}
```

## User Object Structure
```javascript
{
  rollNumber: string,
  fullName: string,
  photoUrl: string,
  gender: string,
  studentMobile: string,
  parentMobile: string,
  bloodGroup: string,
  // ... other user properties
}
```

## QR Code Data
The QR code contains JSON data with:
- Student ID
- Full name
- Blood group
- Contact number
- Expiry date
- Course title

## Error Handling
- Missing profile photo: Shows error message and disables generation
- Image loading failures: Graceful fallbacks with placeholders
- PDF generation errors: User-friendly error messages
- Network issues: Retry mechanisms

## File Output
- Format: PDF
- Size: Standard ID card dimensions (85.6mm x 53.98mm)
- Pages: 2 (front and back)
- Filename: `{studentId}_{courseTitle}_IDCard.pdf`

## Styling
- Follows the futuristic design system
- Electric/Cyber color scheme
- Responsive modal design
- Loading states and animations
- Interactive hover effects

## Security Considerations
- QR code data is not encrypted (contains basic info only)
- No sensitive data included in the card
- Client-side PDF generation (no server storage)
- Immediate download (no temporary files)

## Browser Compatibility
- Modern browsers with Canvas API support
- PDF download functionality
- Base64 image encoding support

## Future Enhancements
- Batch ID card generation for multiple courses
- Custom templates for different course types
- Digital signature integration
- Enhanced security features
- Print-ready formatting options