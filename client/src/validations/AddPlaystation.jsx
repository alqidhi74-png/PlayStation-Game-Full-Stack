import * as yup from "yup";

export const AddPlaystationSchema = yup.object().shape({
  gameCode: yup
    .number()
    .typeError("Game code must be a number")
    .required("Game code is required")
    .integer("Game code must be an integer")
    .positive("Game code must be positive"),
  title: yup.string().required("Title is required"),
  releaseYear: yup
    .number()
    .typeError("Release year must be a number")
    .required("Release year is required")
    .integer("Release year must be an integer"),
  gamePicture: yup
    .string()
    .url("Must be a valid URL")
    .nullable()
    .notRequired(),
  description: yup.string().nullable().notRequired(),
});

