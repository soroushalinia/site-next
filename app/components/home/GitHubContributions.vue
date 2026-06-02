<script setup lang="ts">
interface DayData {
  date: string;
  count: number;
  level: number;
}

interface ContributionData {
  total: number;
  contributions: DayData[];
}

const { t, n } = useI18n();

const { data, status } = useAsyncData<ContributionData>(
  "github-contributions",
  async () => {
    try {
      const raw = await $fetch<{
        total: Record<string, number>;
        contributions: DayData[];
      }>("https://github-contributions-api.jogruber.de/v4/soroushalinia", {
        headers: { Accept: "application/json" },
      });

      const now = new Date();
      const oneYearAgo = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 365,
      );

      const recent = raw.contributions.filter((c) => {
        const parts = c.date.split("-").map(Number);
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        return d >= oneYearAgo && d <= now;
      });

      return {
        total: recent.reduce((sum, c) => sum + c.count, 0),
        contributions: recent,
      };
    } catch {
      return { total: 0, contributions: [] };
    }
  },
);

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const levelColors = [
  "bg-muted",
  "bg-primary/20",
  "bg-primary/40",
  "bg-primary/70",
  "bg-primary",
];

const grid = computed(() => {
  if (!data.value?.contributions?.length) {
    return { weeks: [], monthLabels: [] };
  }

  const all = data.value.contributions.map((c) => {
    const parts = c.date.split("-").map(Number);
    return {
      date: new Date(parts[0], parts[1] - 1, parts[2]),
      count: c.count,
      level: Math.min(c.level, 4),
    };
  });

  all.sort((a, b) => a.date.getTime() - b.date.getTime());

  const start = new Date(all[0].date);
  start.setDate(start.getDate() - start.getDay());

  const end = new Date(all[all.length - 1].date);
  if (end.getDay() < 6) {
    end.setDate(end.getDate() + (6 - end.getDay()));
  }

  const dayMap = new Map<number, number>();
  for (const d of all) {
    dayMap.set(d.date.getTime(), d.level);
  }

  const weeks: { days: number[] }[] = [];
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;

  const cursor = new Date(start);
  let col = 0;

  while (cursor <= end) {
    const weekDays: number[] = [];
    for (let d = 0; d < 7; d++) {
      const level = dayMap.get(cursor.getTime()) ?? 0;
      weekDays.push(level);

      if (cursor.getMonth() !== lastMonth) {
        monthLabels.push({ label: months[cursor.getMonth()], col });
        lastMonth = cursor.getMonth();
      }

      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push({ days: weekDays });
    col++;
  }

  return { weeks, monthLabels };
});
</script>

<template>
  <div class="rounded-lg border bg-card p-4 w-full">
    <div
      v-if="status === 'pending'"
      class="h-[130px] flex items-center justify-center text-sm text-muted-foreground"
    >
      Loading...
    </div>
    <div v-else class="overflow-x-auto overflow-y-hidden">
      <div class="flex flex-col gap-1 w-[750px] mx-auto">
        <div class="flex gap-[3px] mb-[2px] text-[10px] text-muted-foreground">
          <div
            v-for="(label, i) in grid.monthLabels"
            :key="i"
            :style="{
              width:
                i < grid.monthLabels.length - 1
                  ? `${(grid.monthLabels[i + 1].col - label.col) * 14 - 3}px`
                  : `${(grid.weeks.length - label.col) * 14 - 3}px`,
            }"
          >
            {{ label.label }}
          </div>
        </div>
        <div class="flex gap-[3px]">
          <div class="flex gap-[3px]">
            <div
              v-for="(week, wi) in grid.weeks"
              :key="wi"
              class="flex flex-col gap-[3px]"
            >
              <div
                v-for="(level, di) in week.days"
                :key="di"
                class="size-[11px] rounded-[3px]"
                :class="levelColors[level]"
              />
            </div>
          </div>
        </div>
        <div
          class="flex items-center justify-end gap-1 mt-2 text-[10px] text-muted-foreground"
        >
          <span>{{ t("home_page.github_less") }}</span>
          <span
            v-for="l in 5"
            :key="l"
            class="size-[10px] rounded-[2px]"
            :class="levelColors[l - 1]"
          />
          <span>{{ t("home_page.github_more") }}</span>
        </div>
      </div>
    </div>
    <div
      class="mt-3 pt-3 border-t border-border text-center text-sm text-muted-foreground"
    >
      {{ t("home_page.github_contributions", { n: n(data?.total ?? 0) }) }}
    </div>
  </div>
</template>
