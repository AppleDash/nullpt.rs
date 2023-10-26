import {readFileSync} from 'fs';
import remarkGfm from 'remark-gfm';
import rehypePrism from '@mapbox/rehype-prism';
import PostPage from './blog-page';
import {compileMDX} from 'next-mdx-remote/rsc';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import '../styles/codeblocks.css';
import {postFilePaths} from '../utils/mdxUtils';

export const dynamicParams = false;

export type Heading = {
	slug: string;
	title: string;
	level: number;
};

function slugify(text: string) {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-");
}

function extractHeadings(content: string): Heading[] {
	const headings: Heading[] = [];
  
	// match the `#` syntax for headings
	const headingMatcher = /^(#+)\s(.+)$/gm;
  
	let match = headingMatcher.exec(content);
	while (match !== null) {
	  const level = match[1].length;
	  const title = match[2].trim();
	  const slug = slugify(title);
  
	  headings.push({ slug, title, level });
	  match = headingMatcher.exec(content);
	}
  
	return headings;
}

const MDX_COMPONENTS = {
	h1: (props: any) => <h1 id={slugify(props.children)}>{props.children}</h1>,
	h2: (props: any) => <h2 id={slugify(props.children)}>{props.children}</h2>,
	WebGLFingerprint: dynamic(() => import('../client/components/webgl_fingerprint')),
	OldPost: dynamic(() => import('../client/components/old_post')),
	img: (props: any) => (
		<figure className="prose-img flex flex-col items-center">
			<Image {...props} layout="responsive" loading="lazy" width={100} height={100} />
			<figcaption>{props.alt}</figcaption>
		</figure>
	),
};

async function getMDXSource(slug: string) {
	const postFilePath = (await postFilePaths).filter(p => p.includes(slug));
	const source = readFileSync(postFilePath[0], 'utf-8');
	const headings = extractHeadings(source);
	const mdxSource = await compileMDX({
		source,
		// @ts-ignore
		components: MDX_COMPONENTS,
		options: {
			parseFrontmatter: true,
			mdxOptions: {
				remarkPlugins: [remarkGfm],
				rehypePlugins: [rehypePrism],
			},
		},
	});

	return {mdxSource, headings};
}

export default async function Page({params}: {params: {slug: string}}) {
	const {mdxSource, headings} = await getMDXSource(params.slug);
	return <PostPage content={mdxSource.content} headings={headings} frontMatter={mdxSource.frontmatter} />;
}

export async function generateStaticParams() {
	const filePaths = await postFilePaths;
	const mdxSources = filePaths.map(filePath => {
		const source = readFileSync(filePath);

		return compileMDX({
			source,
			// @ts-ignore
			components: MDX_COMPONENTS,
			options: {
				parseFrontmatter: true,
				mdxOptions: {
					remarkPlugins: [remarkGfm],
					rehypePlugins: [rehypePrism],
				},
			},
		});
	});
	const resolvedSources = await Promise.all(mdxSources);
	const slugs = resolvedSources.map(s => {
		return {slug: s.frontmatter.slug};
	});
	return slugs;
}