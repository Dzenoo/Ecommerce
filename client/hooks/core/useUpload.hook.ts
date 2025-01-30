import React, { useState } from 'react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';

const useUpload = (options: DropzoneOptions) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (options.multiple) {
        setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
      } else {
        setSelectedFiles(acceptedFiles);
      }
    },
    [options.multiple],
  );

  const { getRootProps, getInputProps } = useDropzone({
    ...options,
    onDrop,
  });

  const restart = () => {
    setSelectedFiles([]);
  };

  return {
    selectedFiles,
    getInputProps,
    getRootProps,
    restart,
  };
};

export { useUpload };
