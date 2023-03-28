import { prisma } from "../../config/defaultValues.config.js";

export const getUserProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(req.userId),
    },
  });

  // sanitized user password
  delete user.password;

  // return 200 response
  return res.status(200).json({
    message: "User fetch successfully.",
    data: user,
  });
};
