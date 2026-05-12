export const dynamic = 'force-dynamic';

async function getPostHogStats() {
  const baseUrl = `https://us.posthog.com/api/projects/${process.env.POSTHOG_PROJECT_ID}/query/`;
  const headers = {
    Authorization: `Bearer ${process.env.POSTHOG_PERSONAL_API_KEY}`,
    'Content-Type': 'application/json',
  };

  const events = [
    'product_viewed',
    'added_to_cart',
    'checkout_started',
    'order_completed',
  ];

  const results = await Promise.all(
    events.map(async (event) => {
      const res = await fetch(baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: {
            kind: 'HogQLQuery',
            query: `SELECT count() FROM events
                    WHERE event = '${event}'
                    AND timestamp >= now() - interval 7 day
                    AND NOT startsWith(properties.$host, 'localhost')`,
          },
          refresh: 'force_cache',
        }),
      });

      if (!res.ok) return { event, count: 0 };
      const data = await res.json();

      const count = (data.results?.[0]?.[0] as number) ?? 0;
      return { event, count };
    }),
  );

  return results;
}

export default async function AdminAnalyticsPage() {
  const stats = await getPostHogStats();

  const labels: Record<string, string> = {
    product_viewed: 'Product Views',
    added_to_cart: 'Add to Cart',
    checkout_started: 'Checkout Started',
    order_completed: 'Orders Completed',
  };

  // Funnel conversion: views → cart → checkout → order
  const views = stats.find((s) => s.event === 'product_viewed')?.count ?? 0;
  const carts = stats.find((s) => s.event === 'added_to_cart')?.count ?? 0;
  const checkouts =
    stats.find((s) => s.event === 'checkout_started')?.count ?? 0;
  const orders = stats.find((s) => s.event === 'order_completed')?.count ?? 0;

  const conversionRate = views > 0 ? ((orders / views) * 100).toFixed(1) : '—';

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-brand-800">
        Analytics (last 7 days)
      </h1>

      {/* Event counts */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ event, count }) => (
          <div
            key={event}
            className="bg-white border border-surface-200 rounded-lg p-6"
          >
            <p className="text-sm text-surface-500">{labels[event]}</p>
            <p className="text-3xl font-bold mt-1 text-brand-800">{count}</p>
          </div>
        ))}
      </div>

      {/* Funnel */}
      <div className="bg-white border border-surface-200 rounded-lg p-6 space-y-4">
        <h2 className="font-semibold text-brand-700">Checkout Funnel</h2>
        <div className="space-y-3">
          {[
            { label: 'Product Views', value: views, pct: 100 },
            {
              label: 'Added to Cart',
              value: carts,
              pct: views > 0 ? (carts / views) * 100 : 0,
            },
            {
              label: 'Checkout Started',
              value: checkouts,
              pct: views > 0 ? (checkouts / views) * 100 : 0,
            },
            {
              label: 'Orders Completed',
              value: orders,
              pct: views > 0 ? (orders / views) * 100 : 0,
            },
          ].map(({ label, value, pct }) => (
            <div key={label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-surface-700">{label}</span>
                <span className="font-semibold text-brand-800">
                  {value} ({pct.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-surface-100 rounded-full h-2">
                <div
                  className="bg-brand-600 h-2 rounded-full"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-surface-500">
          Overall conversion:{' '}
          <span className="font-semibold text-brand-800">
            {conversionRate}%
          </span>
        </p>
      </div>
    </div>
  );
}
