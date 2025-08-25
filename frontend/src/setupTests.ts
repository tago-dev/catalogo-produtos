import '@testing-library/jest-dom';
import 'whatwg-fetch';
import axios from 'axios';

afterEach(() => {
	jest.clearAllMocks();
});

beforeEach(() => {
	// por padrão, chamadas GET retornam lista vazia nos testes
	(axios.get as unknown as jest.Mock).mockResolvedValue({ data: [] });
	// axios.create deve devolver o próprio mock para manter interceptors/assinatura
	(axios.create as unknown as jest.Mock).mockReturnValue(axios as any);
});
