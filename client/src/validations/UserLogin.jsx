import * as yup from "yup";

export const UserLogin = yup.object().shape({
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
});

