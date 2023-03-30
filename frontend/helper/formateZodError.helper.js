import { ZodError } from "zod";

export const formatZodError = async ({ error }) => {
  // parse error obj
  const errors = JSON.parse(error.message);

  const formattedError = {};

  // format error
  for (const error of errors) {
    const fieldName = error.path[0];
    const errorMessage = error.message;
    formattedError[fieldName] = errorMessage;
  }

  //send formatted error
  return formattedError;
};
