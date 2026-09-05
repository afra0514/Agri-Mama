import React from 'react';
import { Paperclip } from 'lucide-react'; 

const FileUpload = ({ onFileSelect }) => {
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
      e.target.value = null; 
    }
  };

  return (
    <div style={{position: 'relative'}}>
      <input 
        type="file" 
        id="file-upload" 
        style={{display: 'none'}} 
        accept="image/*, .pdf" 
        onChange={handleChange} 
      />
      <label 
        htmlFor="file-upload" 
        className="ms-icon-btn" 
        style={{display: 'block', cursor: 'pointer'}}
        title="Attach Image or PDF"
      >
        <Paperclip size={22} />
      </label>
    </div>
  );
};

export default FileUpload;