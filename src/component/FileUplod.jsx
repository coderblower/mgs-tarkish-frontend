import React, { useRef } from "react";

const FileUplod = ({ setFile, isPIF }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(setFile)
    setFile(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  return (
    <div>
     

      <input
        className="hidden"
        id="Images"
        type="file"
        name="images"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
    </div>
  );
};

export default FileUplod;
