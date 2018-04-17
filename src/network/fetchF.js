//@flow
let fetchF;

if (process.env.NODE_ENV !== "development") {
    fetchF = fetch;
} else {
    const mockAPI = require("data/mock-api").default;
    fetchF = (uri: string, options: Object): Promise<*> => {
        return (
            // mockAPI(uri, options) ||
            fetch("https://localhost:5000/ledger" + uri, options)
        );
    };
}

export default fetchF;
