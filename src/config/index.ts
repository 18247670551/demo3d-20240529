const ENV_MODE = import.meta.env.MODE

const BASE_URL = import.meta.env.VITE_BASE_URL

const HTTP_CONTENT_TYPE = import.meta.env.VITE_HTTP_CONTENT_TYPE
const HTTP_TIMEOUT = import.meta.env.VITE_HTTP_TIMEOUT
const HTTP_CLIENT_TYPE = import.meta.env.VITE_HTTP_CLIENT_TYPE


const APP_NAME = import.meta.env.VITE_APP_NAME
const APP_VERSION = import.meta.env.VITE_APP_VERSION

export {APP_NAME, APP_VERSION, HTTP_CLIENT_TYPE, ENV_MODE, BASE_URL, HTTP_CONTENT_TYPE, HTTP_TIMEOUT}