import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

interface DocViewerProps {
  file: File;
}

export function DocxViewer({ file }: DocViewerProps) {
  const docs = [{ uri: URL.createObjectURL(file) }];

  return (
    <div className="w-full h-[600px] border rounded-lg overflow-hidden">
      <DocViewer
        documents={docs}
        pluginRenderers={DocViewerRenderers}
        className="h-full"
        config={{
          header: {
            disableHeader: true,
            disableFileName: true,
          },
        }}
      />
    </div>
  );
}
