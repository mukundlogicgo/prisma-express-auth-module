import { prisma } from "../../config/defaultValues.config.js";

export const getUserProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(req.userId),
    },
  });

  if (!user) {
    return res.status(404).json({
      message: `User not found please register`,
    });
  }

  // sanitized user password
  delete user.password;

  // return 200 response
  return res.status(200).json({
    message: "User fetch successfully.",
    data: user,
  });
};
