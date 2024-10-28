import React from "react";

const InputField = ({ value, setValue, type = "text", placeholder, title }) => {
  return (
    <div className="flex-1">
      <p className="text-[17px] font-[500] mb-2 text-[#202020]">{title}</p>
      <input
        className={`px-6 py-[13px] border-2 border-[#C5BFBF] text-gray-700 font-[500]  w-full  rounded-md outline-none`}
        type={type}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;
