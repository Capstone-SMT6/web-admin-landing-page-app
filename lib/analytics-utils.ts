export interface WikiRawData {
  descriptions?: Record<string, string>;
  data?: Record<string, Array<{ date: string; views: string | number }>>;
}

export interface WikiDataPoint {
  article: string;
  date: string; // YYYY-MM-DD
  views: number;
}

export interface CorrelationResult {
  columns: string[];
  matrix: number[][];
}

// Parse the raw JSON data into a flat array of data points
export function parseWikiData(raw: any): { df: WikiDataPoint[]; descriptions: Record<string, string> } {
  const df: WikiDataPoint[] = [];
  const descriptions: Record<string, string> = {};

  // Extract from array wrapper or direct object
  const doc = Array.isArray(raw) ? raw[0] : raw;
  if (!doc) return { df, descriptions };

  // Parse descriptions
  if (doc.descriptions) {
    for (const [topic, desc] of Object.entries(doc.descriptions)) {
      descriptions[topic.replace(/_/g, " ")] = desc as string;
    }
  }

  // Parse data points
  const dataDict = doc.data || {};
  for (const [article, entries] of Object.entries(dataDict)) {
    if (!Array.isArray(entries)) continue;
    const articleName = article.replace(/_/g, " ");
    for (const entry of entries) {
      if (entry && entry.date && entry.views !== undefined) {
        const viewsNum = parseInt(String(entry.views), 10);
        if (!isNaN(viewsNum)) {
          df.push({
            article: articleName,
            date: entry.date.split("T")[0], // Keep only YYYY-MM-DD
            views: viewsNum,
          });
        }
      }
    }
  }

  return { df, descriptions };
}

// Graph 1: Top 10 Most Researched Fitness Topics (Average Daily Views)
export function getTop10Topics(df: WikiDataPoint[]) {
  const sumMap: Record<string, number> = {};
  const countMap: Record<string, number> = {};

  for (const point of df) {
    sumMap[point.article] = (sumMap[point.article] || 0) + point.views;
    countMap[point.article] = (countMap[point.article] || 0) + 1;
  }

  return Object.keys(sumMap)
    .map((article) => ({
      article,
      avgViews: Math.round(sumMap[article] / countMap[article]),
    }))
    .sort((a, b) => b.avgViews - a.avgViews)
    .slice(0, 10);
}

// Helpers for Trend Line Charts
export function getTop5TrendingList(df: WikiDataPoint[]): string[] {
  const sumMap: Record<string, number> = {};
  const countMap: Record<string, number> = {};

  for (const point of df) {
    sumMap[point.article] = (sumMap[point.article] || 0) + point.views;
    countMap[point.article] = (countMap[point.article] || 0) + 1;
  }

  return Object.keys(sumMap)
    .map((article) => ({
      article,
      avgViews: sumMap[article] / countMap[article],
    }))
    .sort((a, b) => b.avgViews - a.avgViews)
    .slice(0, 5)
    .map((item) => item.article);
}

// Graph 2: 5-Year Trend: Top 5 Fitness Topics (Monthly Averages)
export function getMonthlyTrends(df: WikiDataPoint[], top5: string[]) {
  // Group by article and year-month (YYYY-MM)
  const monthlyGroup: Record<string, Record<string, { sum: number; count: number }>> = {};

  for (const point of df) {
    if (!top5.includes(point.article)) continue;
    const yearMonth = point.date.slice(0, 7); // "YYYY-MM"
    if (!monthlyGroup[yearMonth]) {
      monthlyGroup[yearMonth] = {};
    }
    if (!monthlyGroup[yearMonth][point.article]) {
      monthlyGroup[yearMonth][point.article] = { sum: 0, count: 0 };
    }
    monthlyGroup[yearMonth][point.article].sum += point.views;
    monthlyGroup[yearMonth][point.article].count += 1;
  }

  // Convert to array of objects compatible with Recharts
  const result = Object.keys(monthlyGroup)
    .sort()
    .map((yearMonth) => {
      const row: Record<string, any> = { date: yearMonth };
      for (const article of top5) {
        const data = monthlyGroup[yearMonth][article];
        row[article] = data ? Math.round(data.sum / data.count) : 0;
      }
      return row;
    });

  return result;
}

// Graph 3: Correlation Matrix Heatmap between top 10 articles
export function getCorrelationMatrix(df: WikiDataPoint[], top10: string[]): CorrelationResult {
  // Step 1: Pivot data: map date -> { article -> views }
  const datePivot: Record<string, Record<string, number>> = {};
  for (const point of df) {
    if (!top10.includes(point.article)) continue;
    if (!datePivot[point.date]) {
      datePivot[point.date] = {};
    }
    datePivot[point.date][point.article] = point.views;
  }

  // Get list of unique dates
  const dates = Object.keys(datePivot).sort();

  // Extract views series for each article
  const series: Record<string, number[]> = {};
  for (const article of top10) {
    series[article] = dates.map((date) => datePivot[date][article] ?? 0);
  }

  // Step 2: Calculate Pearson Correlation Coefficient
  const calculatePearson = (x: number[], y: number[]): number => {
    const n = x.length;
    if (n === 0) return 0;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const meanX = sumX / n;
    const meanY = sumY / n;

    let num = 0;
    let denX = 0;
    let denY = 0;

    for (let i = 0; i < n; i++) {
      const diffX = x[i] - meanX;
      const diffY = y[i] - meanY;
      num += diffX * diffY;
      denX += diffX * diffX;
      denY += diffY * diffY;
    }

    if (denX === 0 || denY === 0) return 0;
    return num / Math.sqrt(denX * denY);
  };

  const matrix: number[][] = [];
  for (let i = 0; i < top10.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < top10.length; j++) {
      if (i === j) {
        matrix[i][j] = 1.0;
      } else if (j < i) {
        // Symmetric matrix
        matrix[i][j] = matrix[j][i];
      } else {
        matrix[i][j] = Number(calculatePearson(series[top10[i]], series[top10[j]]).toFixed(3));
      }
    }
  }

  return { columns: top10, matrix };
}

// Graphs 4, 5, 6: Daily trend for N days (7D, 30D, 1Y with rolling)
export function getTrendingOverTime(df: WikiDataPoint[], days: number, top5: string[]) {
  // Find the latest date in the dataset
  let maxDateMs = 0;
  for (const p of df) {
    const time = new Date(p.date).getTime();
    if (time > maxDateMs) maxDateMs = time;
  }
  if (maxDateMs === 0) return [];

  const maxDate = new Date(maxDateMs);
  const cutoffDate = new Date(maxDate);
  cutoffDate.setDate(cutoffDate.getDate() - days);

  // Filter dataset by date and top 5 articles
  const filtered = df.filter((p) => {
    const d = new Date(p.date);
    return d >= cutoffDate && d <= maxDate && top5.includes(p.article);
  });

  // Group by date
  const dateMap: Record<string, Record<string, number>> = {};
  for (const p of filtered) {
    if (!dateMap[p.date]) {
      dateMap[p.date] = {};
    }
    dateMap[p.date][p.article] = p.views;
  }

  const sortedDates = Object.keys(dateMap).sort();

  // If days is 365, compute 7-day rolling average
  if (days >= 365) {
    // We need to retrieve views for rolling window calculation
    // To do rolling average accurately, we pivot the entire dataset for top5
    const allPivot: Record<string, Record<string, number>> = {};
    for (const p of df) {
      if (!top5.includes(p.article)) continue;
      if (!allPivot[p.date]) {
        allPivot[p.date] = {};
      }
      allPivot[p.date][p.article] = p.views;
    }
    const allDates = Object.keys(allPivot).sort();

    // Map date string to index in sorted dates for O(1) lookups
    const dateIndexMap = new Map(allDates.map((date, idx) => [date, idx]));

    return sortedDates.map((date) => {
      const row: Record<string, any> = { date };
      const currentIdx = dateIndexMap.get(date) ?? 0;

      for (const article of top5) {
        let sum = 0;
        let count = 0;
        // Compute 7-day rolling average (current index and 6 previous days)
        for (let offset = 0; offset < 7; offset++) {
          const checkIdx = currentIdx - offset;
          if (checkIdx >= 0) {
            const checkDate = allDates[checkIdx];
            const views = allPivot[checkDate]?.[article];
            if (views !== undefined) {
              sum += views;
              count++;
            }
          }
        }
        row[article] = count > 0 ? Math.round(sum / count) : 0;
      }
      return row;
    });
  }

  // Otherwise return raw daily views
  return sortedDates.map((date) => {
    const row: Record<string, any> = { date };
    for (const article of top5) {
      row[article] = dateMap[date][article] ?? 0;
    }
    return row;
  });
}
