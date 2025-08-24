import { jest } from '@jest/globals';
import { createClient } from '../../src/lib/supabase/client';

jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(() => ({ type: 'browser' }))
}));

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({ type: 'server' }))
}));

const { createBrowserClient } = require('@supabase/ssr');
const { createClient: createServerClient } = require('@supabase/supabase-js');

describe('createClient', () => {
  const env = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      NEXT_PUBLIC_SUPABASE_URL: 'http://localhost',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon',
      SUPABASE_SERVICE_ROLE_KEY: 'service'
    } as any;
  });

  afterEach(() => {
    process.env = env;
    jest.clearAllMocks();
  });

  test('returns server client on the server', () => {
    const origWindow = (global as any).window;
    delete (global as any).window;
    const client = createClient();
    expect(createServerClient).toHaveBeenCalled();
    expect(client).toEqual({ type: 'server' });
    (global as any).window = origWindow;
  });

  test('returns browser client in the browser', () => {
    (global as any).window = {};
    const client = createClient();
    expect(createBrowserClient).toHaveBeenCalled();
    expect(client).toEqual({ type: 'browser' });
    delete (global as any).window;
  });

  test('logs error when variables are missing', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    createClient();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
