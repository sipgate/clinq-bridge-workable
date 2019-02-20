import { Adapter, Config, Contact, start } from "@clinq/bridge";
import axios from "axios";

interface Candidate {
	id: string | null;
	name: string | null;
	profile_url: string;
	email: string | null;
	phone: string | null;
}

interface CandidateResponse {
	candidates: Candidate[];
	paging?: {
		next: string;
	};
}

const getContacts = async (
	config: Config,
	accumulatedContacts: Contact[] = [],
	nextPageUrl?: string
): Promise<Contact[]> => {
	const url = nextPageUrl || `${config.apiUrl}/spi/v3/candidates`;
	const result = await axios.get<CandidateResponse>(url, {
		headers: {
			Authorization: `Bearer ${config.apiKey}`
		}
	});

	const contacts = result.data.candidates
		.filter(candidate => Boolean(candidate.phone))
		.map<Contact>(candidate => ({
			id: candidate.id,
			name: candidate.name,
			firstName: null,
			lastName: null,
			organization: null,
			email: candidate.email,
			phoneNumbers: [
				{
					label: null,
					phoneNumber: candidate.phone
				}
			],
			contactUrl: candidate.profile_url,
			avatarUrl: null
		}));

	const mergedContacts = [...accumulatedContacts, ...contacts];

	if (result.data.paging) {
		return getContacts(config, mergedContacts, result.data.paging.next);
	}

	return mergedContacts;
};

class WorkableAdapter implements Adapter {
	public async getContacts(config: Config): Promise<Contact[]> {
		return getContacts(config);
	}
}

start(new WorkableAdapter());
