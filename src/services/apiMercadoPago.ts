import axios from "axios";


const apiMercadoPago = axios.create({
    baseURL: 'https://api.mercadopago.com'
});


apiMercadoPago.interceptors.request.use(async config => {
    const TOKEN = process.env.PRIV_TOKEN_MERCADO_PAGO;

    config.headers.Authorization = `Bearer ${TOKEN}`;

    return config;
})

export default apiMercadoPago;
