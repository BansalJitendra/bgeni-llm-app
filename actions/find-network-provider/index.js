// PLACEHOLDER — no real data configured for this tool yet.
// This is NOT real data. Replace MOCK_DATA with a real API call —
// see the TODO block below the handler for endpoint details.
const MOCK_DATA = [
  {
    store_id: 'N/A',
    name: 'Sample Network Provider — replace with real data',
    provider_type: 'N/A',
    address: 'N/A',
    city: 'N/A',
    state: 'N/A',
    pincode: 'N/A',
    phone: 'N/A',
    latitude: 0,
    longitude: 0,
    distance_km: 0,
    service_notes: 'N/A',
    directions_url: 'N/A',
  },
];

module.exports = async ({
  provider_type = '',
  state = '',
  city = '',
  pincode = '',
  provider_name = '',
  latitude = null,
  longitude = null,
} = {}) => {
  if (!provider_type || typeof provider_type !== 'string' || !provider_type.trim()) {
    return {
      content: [{ type: 'text', text: 'Please provide a provider_type (e.g. network hospital, network garage, or Bajaj General branch) to search.' }],
      // structuredContent.providers — bare array outputSchema; key derived from actionName "find_network_provider"
      structuredContent: { providers: [] },
    };
  }

  const norm = (v) => String(v || '').trim().toLowerCase();
  const wantType = norm(provider_type);
  const wantState = norm(state);
  const wantCity = norm(city);
  const wantPincode = norm(pincode);
  const wantName = norm(provider_name);

  const results = MOCK_DATA.filter((item) => {
    if (wantType && norm(item.provider_type) !== 'n/a' && !norm(item.provider_type).includes(wantType)) return false;
    if (wantState && norm(item.state) !== 'n/a' && norm(item.state) !== wantState) return false;
    if (wantCity && norm(item.city) !== 'n/a' && norm(item.city) !== wantCity) return false;
    if (wantPincode && norm(item.pincode) !== 'n/a' && norm(item.pincode) !== wantPincode) return false;
    if (wantName && !norm(item.name).includes(wantName)) return false;
    return true;
  });

  if (results.length === 0) {
    return {
      content: [{ type: 'text', text: 'No network providers found for that search. Try a different city, PIN code, or provider name.' }],
      structuredContent: { providers: [] },
    };
  }

  return {
    content: [{ type: 'text', text: `Found ${results.length} network provider location${results.length === 1 ? '' : 's'}. Please reconfirm current network participation and cashless/claim authorization before admission or before vehicle repairs begin.` }],
    // structuredContent.providers — bare array outputSchema; key derived from actionName "find_network_provider"
    structuredContent: { providers: results },
  };
};

/*
 * TODO: Replace MOCK_DATA with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   GET ${process.env.API_BASE_URL}/network-providers?type=${provider_type}&city=${city}&pincode=${pincode}
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the website's API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Authentication: check the website's developer docs or network requests
 *   captured during browsing for the correct auth header pattern.
 *
 * Example fetch:
 *   const res = await fetch(
 *     `${process.env.API_BASE_URL}/network-providers?type=${encodeURIComponent(provider_type)}`,
 *     { headers: { 'Authorization': `Bearer ${process.env.API_KEY}` } }
 *   )
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
