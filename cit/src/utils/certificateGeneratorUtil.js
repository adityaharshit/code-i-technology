// cit/src/utils/certificateGeneratorUtil.js
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";
import codingCertificateTemplate from "../assets/coding.jpeg";
import typingCertificateTemplate from "../assets/typing.jpeg";

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

export const generateCertificatePDF = async (data) => {
    const toastId = toast.loading("Generating Certificate...");

    try {
        if (data.courseType !== 3) {
            const { dataURL, width, height } = await loadImageAsBase64(
                codingCertificateTemplate
            );

            // A4 landscape is 297x210 mm. Let's use that aspect ratio.
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4",
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(dataURL, "JPEG", 0, 0, pdfWidth, pdfHeight);

            // --- Text Placement (Coordinates are estimates based on A4 landscape) ---

            // Certificate Number
            pdf.setFontSize(12);
            pdf.setTextColor("#333333");
            pdf.text(data.certificateNumber, 44, 48.5);

            // Student Name
            pdf.setFontSize(24);
            pdf.setTextColor("#000"); // Gold-like color
            pdf.setFont("times", "bold");
            pdf.text(data.studentName, pdfWidth / 2, 113, { align: "center" });
            pdf.setFont("times", "regular");

            // Course Name
            // if(data.courseName.length > 40){
            //     pdf.setFontSize(14);
            // }
            pdf.setFontSize(18);
            pdf.setTextColor("#000");
            pdf.text(data.courseName.toUpperCase(), pdfWidth / 2+15, 129, {
                align: "center",
            });

            // Dates
            const formatDate = (dateStr) =>
                new Date(dateStr).toLocaleDateString("en-GB");
            const startDate = formatDate(data.startDate);
            pdf.setFontSize(18);
            pdf.text(startDate, 100, 136);

            const endDate = formatDate(data.endDate);
            pdf.setFontSize(18);
            pdf.text(endDate, 170, 136);

            // Instructor Name
            const instructorText = `MR ${data.instructorName.toUpperCase()}`;
            pdf.text(instructorText, 110, 151, { align: "center" });

            // Issue Date
            pdf.setFontSize(18);
            pdf.text(formatDate(data.issueDate), 40, 178);

            const fileName = `${data.studentName}_${data.courseName}_Certificate.pdf`;
            pdf.save(fileName);

            toast.success("Certificate Downloaded!", { id: toastId });
        }else{
            // Typing course certificate
            // console.log(data);
            const { dataURL, width, height } = await loadImageAsBase64(
                typingCertificateTemplate
            );

            // A4 landscape is 297x210 mm. Let's use that aspect ratio.
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4",
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(dataURL, "JPEG", 0, 0, pdfWidth, pdfHeight);

            // --- Text Placement (Coordinates are estimates based on A4 landscape) ---

            // Certificate Number
            pdf.setFontSize(12);
            pdf.setTextColor("#333333");
            pdf.text(data.certificateNumber, 46, 46.5);

            // Student Name
            pdf.setFontSize(24);
            pdf.setTextColor("#000"); // Gold-like color
            pdf.setFont("times", "bold");
            pdf.text(data.studentName, pdfWidth / 2, 97, { align: "center" });
            pdf.setFont("times", "regular");


            // Dates
            const formatDate = (dateStr) =>
                new Date(dateStr).toLocaleDateString("en-GB");
            const startDate = formatDate(data.startDate);
            pdf.setFontSize(18);
            pdf.text(startDate, 125, 114);

            const endDate = formatDate(data.endDate);
            pdf.setFontSize(18);
            pdf.text(endDate, 180, 114);

            // Instructor Name
            const instructorText = `MR ${data.instructorName.toUpperCase()}`;
            pdf.text(instructorText, 110, 127, { align: "center" });
            
            // Typing speed english
            pdf.text(`${data.speedEnglish}`, 155, 150, { align: "center" });
            
            //Typing speed hindi
            pdf.text(`${data.speedHindi}`, 155, 157, { align: "center" });

            // Issue Date
            pdf.setFontSize(18);
            pdf.text(formatDate(data.issueDate), 40, 183);

            const fileName = `${data.studentName}_${data.courseName}_Certificate.pdf`;
            pdf.save(fileName);

            toast.success("Certificate Downloaded!", { id: toastId });
        }
    } catch (error) {
        console.error("Error in PDF generation utility:", error);
        toast.error(error.message || "Failed to generate certificate.", {
            id: toastId,
        });
        throw error;
    }
};
