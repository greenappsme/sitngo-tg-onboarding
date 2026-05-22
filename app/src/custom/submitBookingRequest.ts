import Telegram from '@twa-dev/sdk';

const BOOKING_API_URL = import.meta.env.VITE_BOOKING_API_URL as string | undefined;

export async function submitBookingRequest(
  sdk: typeof Telegram,
  payload: Record<string, unknown>
): Promise<'api' | 'sendData' | 'failed'> {
  if (BOOKING_API_URL && sdk.initData) {
    const response = await fetch(BOOKING_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        initData: sdk.initData,
        payload,
      }),
    });

    if (!response.ok) {
      return 'failed';
    }

    return 'api';
  }

  const data = JSON.stringify({
    payload,
    product: null,
  });

  sdk.sendData(data);

  return 'sendData';
}

export function hasBookingApiUrl(): boolean {
  return Boolean(BOOKING_API_URL);
}
