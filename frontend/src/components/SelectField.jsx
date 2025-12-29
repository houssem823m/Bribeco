import { Field, ErrorMessage } from 'formik';

const SelectField = ({
  label,
  name,
  children,
  optional = false,
  disabled,
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
        as="select"
        id={name}
        name={name}
        disabled={disabled}
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        }`}
        {...props}
      >
        {children}
      </Field>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
};

export default SelectField;

