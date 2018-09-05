import { Adapter, Config, Contact, PhoneNumber, start } from "@clinq/bridge";
import { Request } from "express";

class MyAdapter implements Adapter {
	/**
	 * TODO: Fetch contacts from the contacts provider using config.apiKey and config.apiUrl or throw on error
	 */
	public async getContacts(config: Config): Promise<Contact[]> {
		const phoneNumber: PhoneNumber = {
			label: "Mobile",
			phoneNumber: "+4915799912345"
		};
		const contacts: Contact[] = await Promise.resolve([
			{
				id: "7f23375d-35e2-4034-889a-2bdc9cba9633",
				company: "MyCompany GmbH",
				email: "mustermann@example.com",
				name: "Max Mustermann",
				phoneNumbers: [phoneNumber]
			}
		]);
		return contacts;
	}

	/**
	 * REQUIRED FOR OAUTH2 FLOW
	 * Return the redirect URL for the given contacts provider.
	 * Users will be redirected here to authorize CLINQ.
	 */
	public async getOAuth2RedirectUrl(): Promise<string> {
		const redirectUrl = await Promise.resolve("https://crm.example.com/oauth2/authorize");
		return redirectUrl;
	}

	/**
	 * REQUIRED FOR OAUTH2 FLOW
	 * Users will be redirected here after authorizing CLINQ.
	 *
	 * TODO: Extract the 'code' from request, fetch an access token
	 * and return it as 'apiKey'
	 */
	public async handleOAuth2Callback(req: Request): Promise<Config> {
		// EXAMPLE:
		// const { code } = req.query;
		// const query = queryString.stringify({ code });
		// const response = await request(`https://crm.example.com/oauth2/token?${query}`)
		// return {
		// 	apiKey: response.accessToken,
		// 	apiUrl: response.instanceUrl
		// };

		const config: Config = await Promise.resolve({
			apiKey: "a1b2c3",
			apiUrl: "https://eu5.crm.example.com/api"
		});
		return config;
	}
}

start(new MyAdapter());
