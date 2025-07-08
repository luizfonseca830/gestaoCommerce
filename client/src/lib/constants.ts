export const BASE_API_URL =
    import.meta.env.PROD
        ? "https://gestao-commerce.vercel.app/api"
        : "http://localhost:3000/api";
