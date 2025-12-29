import { Field, ErrorMessage } from 'formik';

const InputField = ({
  label,
  name,
  type = 'text',
  placeholder,
  optional = false,
  ...props
}) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {optional && <span className="text-gray-400">(optionnel)</span>}
        </label>
      )}
      <Field
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        {...props}
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
};

export default InputField;

