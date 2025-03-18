
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const downloadAsPDF = async (
  elementId: string, 
  filename: string = "calculator-results.pdf"
) => {
  try {
    toast.info("Preparing your PDF...");
    
    const element = document.getElementById(elementId);
    if (!element) {
      toast.error("Could not find content to download");
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    // Calculate PDF dimensions (A4 format)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add image to PDF (centered)
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // If content overflows a page, create additional pages
    let heightLeft = imgHeight;
    let position = 0;
    
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Save PDF
    pdf.save(filename);
    toast.success("PDF downloaded successfully!");
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate PDF. Please try again.");
  }
};
