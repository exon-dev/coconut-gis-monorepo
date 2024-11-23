export default function dev(endpoint) {
    return import.meta.env.DEV
        ? `http://127.0.0.1:9000/api${endpoint}`
        : `/api${endpoint}`;
}
