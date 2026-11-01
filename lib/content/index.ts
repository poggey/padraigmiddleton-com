import { getExperience, getPredictions, getSite } from "./data";
import { getPosts } from "./posts";
import { getProjects } from "./projects";

export { getExperience, getPredictions, getSite } from "./data";
export { getPost, getPosts, type Post } from "./posts";
export { getProject, getProjects, type Project } from "./projects";

/**
 * Loads everything and checks how it fits together. Called from the sitemap, so any problem in
 * content/ fails the build with a message naming the file.
 */
export function validateContent() {
  const posts = getPosts({ includeDrafts: true });
  const projects = getProjects();
  const predictions = getPredictions();
  const experience = getExperience();
  const site = getSite();

  for (const post of posts) {
    if (post.predictionId && !predictions.some((p) => p.id === post.predictionId)) {
      throw new Error(`content/posts/${post.slug}.mdx refers to prediction ${post.predictionId}, which is not in content/predictions.json`);
    }
  }
  for (const prediction of predictions) {
    const post = posts.find((p) => p.slug === prediction.essaySlug);
    if (!post) {
      throw new Error(`Prediction ${prediction.id} points to essay "${prediction.essaySlug}", which does not exist`);
    }
    // The claim is never edited after publishing, so it must match the essay word for word.
    const claim = prediction.claim.toLowerCase();
    if (!post.body.toLowerCase().includes(claim)) {
      throw new Error(`Prediction ${prediction.id}'s claim does not appear word for word in content/posts/${post.slug}.mdx`);
    }
  }
  return { posts, projects, predictions, experience, site };
}
