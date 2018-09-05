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

class WorkableAdapter implements Adapter {
  public async getContacts(config: Config): Promise<Contact[]> {
    const instance = axios.create({
      baseURL: `${config.apiUrl}/spi/v3`,
      headers: {
        Authorization: `Bearer ${config.apiKey}`
      }
    });

    // XXX: TODO CLINQ
    // Docs can be found here: https://workable.readme.io/docs/job-candidates-index
    // API Key can be found here: https://sipgate.workable.com/backend/account/integrations
    const result = await instance.get<CandidateResponse>("candidates");

    // TODO Check for result.data.paging and fetch remaining contacts
    // TODO Format phone numbers???
    // TODO Caching???

    return result.data.candidates
      .filter(candidate => !!candidate.phone)
      .map(candidate => ({
        id: candidate.id,
        name: candidate.name,
        company: null,
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
  }
}

start(new WorkableAdapter());
