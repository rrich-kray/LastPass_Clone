import axios from "axios";
import RequestHelpers from "./RequestHelpers"

class AuthenticationUtilities
{
    constructor() { }
    // This will be used by AuthorizeView, Login and Register components
    public async VerifyToken(maxRetries: number, baseUrl: string): Promise<boolean>
    {
        if (!this.DoesTokenExist()) return false;

        const makeRequest = async (
            token: string,
            maxRetries: number,
            retryCount: number,
            baseUrl: string): Promise<boolean> => {
            const options = RequestHelpers.GenerateRequestHeaders();
            console.log(`VarifyToken request headers: ${JSON.stringify(options.headers)}`);
            try {
                const result = await axios
                    .get(`${baseUrl}/VerifyToken`, RequestHelpers.GenerateRequestHeaders()) // Maybe this is always returning false?
                    .then(() => true)
                    .catch(error => { throw new Error(error) });
                console.log(`VerifyToken resul: ${result}`);
                return result;
            } catch (error) { // Anything that is not in the 2xx range will be thrown as an error by axios
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
                console.log(error.config);

                retryCount++;
                if (retryCount > maxRetries) {
                    this.ClearToken(); // Token exists but is not authorized, remove from local storage
                    return false;
                }
                return await makeRequest(token, maxRetries, retryCount, baseUrl);
            }
        }

        return await makeRequest(localStorage.getItem("token")!, maxRetries, 0, baseUrl); // DoesTokenExist ensures this is not null

    }

    public DoesTokenExist = () => localStorage.getItem("token") !== undefined;
    public ClearToken = () => localStorage.removeItem("token");
}

export default AuthenticationUtilities;