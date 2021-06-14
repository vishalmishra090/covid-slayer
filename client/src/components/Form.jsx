import React from "react";

function Form({ className, children, onSubmit }) {
  const handelSubmit = (e) => {
    onSubmit(e);
  };

  return (
    <form
      className={className}
      onSubmit={handelSubmit}
    >
      {children}
    </form>
  );
}

export function FormInput({
  type = "text",
  id ,
  name = "",
  placeholder = "",
  className,
  onChange,
  value = "",
  required = false,
  disabled = false,
  label = "",
}) {
  const handelChange = (e) => {
    onChange(e);
  };


  return(
  <div className={"input-group " + className}>
    {
      !/(radio)|(checkbox)/g.test(type) 
      && label
      && <label htmlFor={id}>{label}</label>
    }
    <input
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      onChange={handelChange}
      value={value}
      required={required}
      disabled={disabled}
    />
    {
      /(radio)|(checkbox)/g.test(type) 
      && label 
      && <label className="r-c-label" htmlFor={id}>{label}</label>
    }
  </div>
  )
}

export default Form;

