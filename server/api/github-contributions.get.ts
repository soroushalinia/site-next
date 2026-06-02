export default defineEventHandler(async () => {
  try {
    const res = await fetch(
      "https://github-contributions-api.jogruber.de/v4/soroushalinia",
      {
        headers: { Accept: "application/json" },
      },
    );

    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }

    const data = (await res.json()) as {
      total: Record<string, number>;
      contributions: { date: string; count: number; level: number }[];
    };

    const now = new Date();
    const oneYearAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 365,
    );

    const recent = data.contributions.filter((c) => {
      const parts = c.date.split("-").map(Number);
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d >= oneYearAgo && d <= now;
    });

    const yearTotal = recent.reduce((sum, c) => sum + c.count, 0);

    return {
      total: yearTotal,
      contributions: recent,
    };
  } catch {
    return {
      total: 0,
      contributions: [],
    };
  }
});
