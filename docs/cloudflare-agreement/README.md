# Cloudflare One-Click Model Agreement Feature

## Background
Meta's Llama 3.2 Vision model is hosted by Cloudflare Workers AI. Cloudflare requires every user (each Cloudflare Account ID) to explicitly agree to Meta's *Terms of Service* (ToS) before this model can be used (returns HTTP 403 error `Model Agreement`).

## New Mechanism (One-Click Agreement)
To improve User Experience, 9router has been equipped with a smart ToS agreement feature:

1. **Smart Error Detection:** When a user performs *Add API Key* or tests the connection (*Test Connection*), the `/api/providers/validate/route.js` and `testUtils.js` endpoints no longer treat `403` as a pure *invalid credentials* validation failure. The API will parse the JSON Error returned by Cloudflare.
2. **Specific Trigger:** If the JSON error contains the phrase `"Model Agreement"`, a special status `MODEL_AGREEMENT_REQUIRED` will be returned to the frontend.
3. **Responsive UI:** The `AddApiKeyModal.js` component in the dashboard will detect this status and dynamically display an **"Agree to Terms & Conditions"** button.
4. **Background Agreement:** When clicked, the button hits the new endpoint `/api/providers/cloudflare-agree/route.js` by sending a JSON payload `{ prompt: "agree" }` using the user's Account ID and API Token credentials.
5. **Success:** If the agreement is accepted, the API connection is automatically validated as successful without the user needing to access the CLI / terminal at all.

### 2. Available Models List Integration (Test Model)
If a *user* (who has already registered their connection) goes to the provider detail menu and clicks the **Test (🧪)** icon on the `llama-3.2-11b-vision-instruct` model (or other restricted models), and Cloudflare responds with a 403 `Model Agreement` error, the UI will display:
1. A specific error message (red).
2. A smart yellow warning box in the *header section* along with an **"Agree to Terms & Conditions"** button.
This button automatically uses the active connection credentials (*backend database*) to send a request to `/api/providers/cloudflare-agree`, so users do not need to retype their API Key.

### 3. Custom Model Integration (Add Custom Model)
If a user tries to specifically add a Cloudflare model that is not yet in the *default list* (e.g., `cf/@cf/meta/llama-3.2-11b-vision-instruct`) via the **"Add Custom Model"** *modal window*, then clicks the **"Test"** button, the system will also catch the *403 error*.
- The *modal* will immediately display the same Warning UI along with the **"Agree to Terms & Conditions"** button.
- Since the Provider ID (*connection ID*) is already passed into the *modal*, the user can directly agree to the ToS on the spot without needing to close the *modal*, and then immediately click **"Test"** again to validate the availability of the model.

### 4. Internationalization (i18n) Support
All warning texts, ToS agreement buttons, and UI notifications (*alerts*) accompanying this feature have been integrated with the 9router language system (`@/i18n/runtime`). This implementation ensures the consistent use of _English base strings_ for the `translate()` functionality, so *multilingual* support is not broken when the *user* changes the language (e.g., from *English* to *Indonesia*).

### 5. Smart Cooldown Lock Clearance (Cache Penalty Destruction)
If an API connection fails due to a *403 Model Agreement error*, 9router's built-in protection mechanism (`testUtils.js` and `auth.js`) will automatically lock the use of the related model (adding a `modelLock_...` *key* to the connection *database*) for a certain period (e.g., 10 seconds to several minutes) to prevent *spam requests*. 
To avoid the issue where a user has already clicked "Agree" but is still rejected by the internal 9router system (showing a `reset after 1m 13s` message), the agreement *endpoint* `/api/providers/cloudflare-agree/route.js` has now been equipped with clearance logic. Immediately after Cloudflare returns a success response, 9router will proactively remove the `lastError` parameter, clear `errorCode`, and destroy all `modelLock_...` history on that connection. As a result, the model can be tested again immediately without waiting for the penalty time to expire.

## Changed File Structure
- `src/app/api/providers/validate/route.js` (Modified: Model Agreement Error Parser & Hardcode model validation check)
- `src/app/api/providers/[id]/test/testUtils.js` (Modified: Error Parser for background jobs & testing)
- `src/app/(dashboard)/dashboard/providers/[id]/AddApiKeyModal.js` (Modified: ToS UI Button addition & i18n Support)
- `src/app/(dashboard)/dashboard/providers/[id]/page.js` (Modified: Smart ToS agreement button in *Available Models* header, *providerId* injection, & i18n Support)
- `src/app/(dashboard)/dashboard/providers/[id]/AddCustomModelModal.js` (Modified: 403 error detection during custom model test & ToS agreement button integration)
- `src/app/api/providers/cloudflare-agree/route.js` (New: Agreement execution endpoint)



## Final Configuration
Run your Docker Build process:
```bash
cd /path/to/9router
docker compose up --build -d
```
