import * as yup from "yup";

export const UserRegister = yup.object().shape({
  username: yup.string().required("Username is required!!!"),
  email: yup
    .string()
    .email("Not a Valid Email Format!!")
    .required("Email is Required.."),
  password: yup
    .string()
    .required("Password is required.")
    .min(8, "Minimum 8 characters required.")
    .max(16, "Maximum 16 characters allowed.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
      "Password must contain uppercase, lowercase, number & special character"
    ),
    dateOfBirth: yup
    .date()
    .transform((value, originalValue) =>
      originalValue === "" ? null : value
    )
    .required("Date of Birth is required")
    .max(new Date(), "Date of Birth cannot be in the future"),  
  gender: yup
    .string()
    .oneOf(["Male", "Female"], "Gender is required")
    .required("Gender is required"),
  checkbox: yup
    .boolean()
    .oneOf([true], "Accept Terms & Conditions is required"),
});
