// cit/src/utils/certificateGeneratorUtil.js
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";
import marksheetTemplate from "../assets/marksheet.jpeg";

const loadImageAsBase64 = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            resolve({
                dataURL: canvas.toDataURL("image/jpeg"),
                width: img.width,
                height: img.height,
            });
        };
        img.onerror = (err) =>
            reject(
                new Error(
                    `Failed to load image at ${src}. Error: ${JSON.stringify(
                        err
                    )}`
                )
            );
        img.src = src;
    });
};

export const generateMarksheetPDF = async (data) => {
    const toastId = toast.loading("Generating Certificate...");

    try {
        if(!data.photoUrl){
            toast.error("User Image is required for marksheet");
            throw new Error("Missing photo")
        }
        const { dataURL: templateDataURL } = await loadImageAsBase64(
            marksheetTemplate
        );
        const {dataURL: photoDataURL} = await loadImageAsBase64(data.photoUrl).catch((e) => {
                            toast.error("Failed to load profile photo.");
                            throw e;
        });
        // console.log(`${width} ${height}`);
        
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        console.log(`${pdfWidth} ${pdfHeight}`);
        pdf.addImage(templateDataURL, "JPEG", 0, 0, pdfWidth, pdfHeight);
        
        pdf.addImage(photoDataURL, "PNG", 164, 34.5, 32.5, 45);
        // --- Text Placement (Coordinates are estimates based on A4 landscape) ---

        // Certificate Number
        pdf.setFontSize(12);
        pdf.setTextColor("#333333");
        pdf.text(data.marksheetNumber, 50, 60);

        // Student Name
        // pdf.setFontSize(24);
        pdf.setTextColor("#000"); // Gold-like color
        // pdf.setFont("helvetica", "bold");
        pdf.text(data.studentName, 50, 68);
        // pdf.setFont("helvetica", "regular");

        // Dates
        const formatDate = (dateStr) =>
            new Date(dateStr).toLocaleDateString("en-GB");
        const startDate = formatDate(data.dob);
        // pdf.setFontSize(18);
        pdf.text(startDate, 50, 77);

        pdf.setFontSize(14);
        pdf.text(`${data.cfMarks}`, 185, 141);
        pdf.text(`${data.msOfficeMarks}`, 185, 158);
        pdf.text(`${data.tallyMarks}`, 185, 175);
        pdf.text(`${data.photoshopMarks}`, 185, 192);
        pdf.text(`${data.ihnMarks}`, 185, 209);

        const totalMarks = 800;
        const marksObtained =
            parseInt(data.cfMarks) +
            parseInt(data.msOfficeMarks) +
            parseInt(data.tallyMarks) +
            parseInt(data.photoshopMarks) +
            parseInt(data.ihnMarks);
        const percentage = (
            (parseInt(marksObtained) / parseInt(totalMarks)) *
            100
        ).toFixed(2);
        let grade = "F";
        if (percentage > 85) grade = "A";
        else if (percentage >= 75) grade = "B";
        else if (percentage >= 60) grade = "C";
        else if (percentage >= 40) grade = "D";

        pdf.text(`${marksObtained}`, 185, 226);
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text(`${grade}`, 60, 236.5);
        pdf.text(`${percentage}%`, 168, 236.5);

        // Issue Date
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "normal");
        pdf.text(formatDate(data.issueDate), 25, 265);

        const fileName = `${data.studentName}_${data.courseName}_Certificate.pdf`;
        pdf.save(fileName);

        toast.success("Certificate Downloaded!", { id: toastId });
    } catch (error) {
        console.error("Error in PDF generation utility:", error);
        toast.error(error.message || "Failed to generate certificate.", {
            id: toastId,
        });
        throw error;
    }
};
