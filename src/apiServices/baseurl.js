import currentEnvironment, { apiBaseUrls, environments } from "app.config";

let url = "";
let razorpay_key = "rzp_test_b0KRZ2WygCRLoz";

if (currentEnvironment === environments.development) {
  url = apiBaseUrls.development;
} else if (currentEnvironment === environments.new_uat) {
  url = apiBaseUrls.new_uat;
} else if (currentEnvironment === environments.uat) {
  url = apiBaseUrls.uat;
} else if (currentEnvironment === environments.production) {
  url = apiBaseUrls.production;
  razorpay_key = "rzp_live_GdORaiZnk9JsJh";
} else if (currentEnvironment === environments.pre_production) {
  url = apiBaseUrls.pre_production;
} else {
  url = apiBaseUrls.development;
}

export const BACKEND_BASE_URL = url;
export { razorpay_key };
