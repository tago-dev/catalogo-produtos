import '@testing-library/jest-dom';
import 'whatwg-fetch';
import axios from 'axios';
jest.mock('axios');

afterEach(() => {
	jest.clearAllMocks();
});

beforeEach(() => {
	// axios.create retorna uma instância com métodos que resolvem Promises
	(axios.create as unknown as jest.Mock).mockImplementation(() => {
		return {
			get: jest.fn().mockResolvedValue({ data: [] }),
			post: jest.fn().mockResolvedValue({ data: {} }),
			put: jest.fn().mockResolvedValue({ data: {} }),
			patch: jest.fn().mockResolvedValue({ data: {} }),
			delete: jest.fn().mockResolvedValue({}),
			interceptors: {
				request: { use: jest.fn() },
				response: { use: jest.fn() },
			},
		} as any;
	});

	// fallback para chamadas diretas em axios (se alguma ocorrer)
	(axios.get as unknown as jest.Mock).mockResolvedValue({ data: [] });
});
