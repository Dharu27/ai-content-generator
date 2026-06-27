import { SignJWT, jwtVerify } from "jose";

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET || "default_super_secret_key_change_me_in_prod";
  return new TextEncoder().encode(secret);
};

export async function generateToken(payload: { userId: number; email: string }) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(getJwtSecretKey());
  
  return token;
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload as { userId: number; email: string };
  } catch (error) {
    return null;
  }
}
