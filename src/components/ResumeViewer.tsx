import { Card } from "@/components/ui/card";
import { DocxViewer } from "./file-viewers/DocViewer";
import { PDFViewer } from "./file-viewers/PdfViewer";
import { TextViewer } from "./file-viewers/TextViewer";

interface ResumeViewerProps {
  file: File;
}

export function ResumeViewer({ file }: ResumeViewerProps) {
  const fileType = file.type;
  const fileExtension = file.name.split(".").pop()?.toLowerCase();

  return (
    <Card className="p-4">
      {(fileType === "application/pdf" || fileExtension === "pdf") && (
        <PDFViewer file={file} />
      )}

      {(fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        fileExtension === "docx") && <DocxViewer file={file} />}

      {(fileType === "text/plain" || fileExtension === "txt") && (
        <TextViewer file={file} />
      )}
    </Card>
  );
}
