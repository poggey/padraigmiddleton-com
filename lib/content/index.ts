import { firstChartId, getChart } from "./charts";
import { getExperience, getSite } from "./data";
import { getPosts } from "./posts";
import { getProjects } from "./projects";

export { firstChartId, getChart, type ChartData } from "./charts";
export { getExperience, getSite } from "./data";
export { getPost, getPosts, type Post } from "./posts";
export { getProject, getProjects, type Project } from "./projects";

/**
 * Loads everything and checks how it fits together. Called from the sitemap, so any problem in
 * content/ fails the build with a message naming the file.
 */
export function validateContent() {
  const posts = getPosts({ includeDrafts: true });
  const projects = getProjects();
  const experience = getExperience();
  const site = getSite();

  for (const post of posts) {
    const chart = firstChartId(post.body);
    if (chart) getChart(chart);
  }
  return { posts, projects, experience, site };
}
