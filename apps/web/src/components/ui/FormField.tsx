import React, {useId} from 'react';

interface FormFieldProps {
  label: string;  
  error?: string;
  children: React.ReactElement<{id?:string; 'aria-describedby'?: string}>;
}




export const FormField = ({ label,  error, children }: FormFieldProps) => {
    const id = useId();
 return (
     <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-surface-700">
      {label}
    </label>
    {React.cloneElement(children, {
      id,
      'aria-describedby': error ? `${id}-error` : undefined,
    })}
    {error && (
      <p id={`${id}-error`} className="text-red-600 text-sm">
        {error}
      </p>
    )}
  </div>
 )
};
