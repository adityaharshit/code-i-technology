import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import toast from "react-hot-toast";
import idCardFrontTemplate from "../assets/id_card_front.jpg";
import idCardBackTemplate from "../assets/id_card_back.jpg";

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
            resolve(canvas.toDataURL("image/png"));
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

export const generateIDCardPDF = async ({ user, course, expiryDate }) => {
    if (!user.photoUrl) {
        toast.error("Profile photo is required for the ID card.");
        throw new Error("Missing photo");
    }

    const generateQRData = () => {
        return JSON.stringify({
            name: user.fullName,
            rollNumber: user.rollNumber,
            course: course.title,
            dob: user.dob
                ? new Date(user.dob).toLocaleDateString("en-CA")
                : "N/A",
            bloodGroup: user.bloodGroup || "N/A",
            // gender: user.gender || "N/A",
            email: user.email || "NA",
            expiryDate: expiryDate,
        });
    };

    try {
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: [53.98, 85.6], // Standard ID card size: width, height
        });

        const cardWidth = 53.98;
        const cardHeight = 85.6;

        const [frontTemplate, backTemplate, userPhoto, qrCodeImage] =
            await Promise.all([
                loadImageAsBase64(idCardFrontTemplate).catch((e) => {
                    toast.error("Failed to load ID card front template.");
                    throw e;
                }),
                loadImageAsBase64(idCardBackTemplate).catch((e) => {
                    toast.error("Failed to load ID card back template.");
                    throw e;
                }),
                loadImageAsBase64(user.photoUrl).catch((e) => {
                    toast.error("Failed to load profile photo.");
                    throw e;
                }),
                QRCode.toDataURL(generateQRData(), {
                    width: 200,
                    margin: 1,
                }).catch((e) => {
                    toast.error("Failed to generate QR code.");
                    throw e;
                }),
            ]);

        // FRONT SIDE
        pdf.addImage(frontTemplate, "JPEG", 0, 0, cardWidth, cardHeight);
        pdf.addImage(userPhoto, "PNG", 4.7, 7.7, 21, 22);

        pdf.setTextColor("#000000");
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        const studentNameParts = user.fullName.split(" ");
        const firstName = studentNameParts[0];
        const lastName = studentNameParts.slice(1).join(" ");
        pdf.text(firstName, cardWidth / 2, 38, { align: "center" });
        if (lastName) {
            pdf.text(lastName, cardWidth / 2, 42, { align: "center" });
        }

        pdf.setFontSize(6);
        pdf.setTextColor("#000000");
        pdf.setFont("helvetica", "normal");
        pdf.text(user.gender || "N/A", 27, 51.5);
        pdf.text(expiryDate, 27, 54.5);
        pdf.text(user.studentMobile || user.parentMobile || "N/A", 27, 58);
        pdf.text(user.bloodGroup || "N/A", 27, 61);

        pdf.addImage(qrCodeImage, "PNG", 35.9, 63.5, 14, 16);

        pdf.setFontSize(9);
        pdf.setTextColor("#EFAF1E");
        pdf.setFont("helvetica", "bold");
        pdf.text(user.rollNumber, 5, 82.5);

        // BACK SIDE
        pdf.addPage();
        pdf.addImage(backTemplate, "JPEG", 0, 0, cardWidth, cardHeight);

        pdf.setFontSize(6);
        pdf.setTextColor("#000000");
        pdf.setFont("helvetica", "normal");
        pdf.text(user.rollNumber, cardWidth / 2, 55.5, { align: "center" });

        const fileName = `${user.rollNumber}_IDCard.pdf`;
        pdf.save(fileName);
    } catch (error) {
        console.error("Error in PDF generation utility:", error);
        // Re-throw the error so the calling function can handle UI state
        throw error;
    }
};
