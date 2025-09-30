const prisma = require("../config/database");

const getCertificateInformation = async (req, res) => {
    try {
        if (!req.params.certNumber) {
            return res.status(404).json({ error: "Empty Certificate Number" });
        }

        const certificate = await prisma.certificate.findUnique({
            where: { certificateNumber: req.params.certNumber },
        });
        if (!certificate) {
            return res.json({ failedMessage: "Certificate Not Found" });
        }
        res.json(certificate);
    } catch (error) {
        console.error("Error fetching certificate information:", error);
        res.status(500).json({ error: "Failed to fetch course details" });
    }
};

module.exports = {
    getCertificateInformation
}