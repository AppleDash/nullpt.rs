import { GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { AuthorLinks } from '../client/components/author_links';
import { postFilePaths } from '../utils/mdxUtils';
import { Heading } from './page';
import { TableOfContents } from '../client/components/table_of_contents';

interface Props {
	content: any;
	headings: Heading[];
	frontMatter: {
		[key: string]: any;
	}
}

export default function PostPage({ content, frontMatter, headings }: Props) {
	return (
		<div className="space-y-4 m-auto max-w-full lg:max-w-3xl transition-all">
			<Head>
				<title>{frontMatter.name}</title>
				<meta name="description" content={frontMatter.excerpt} />
				<meta name="keywords" content={frontMatter.keywords} />
				<meta name="theme-color" content={frontMatter.hidden ? '#ebb305' : '#171717'} />
			</Head>

			{frontMatter.hidden && (
				<div className="bg-yellow-500 text-yellow-900 rounded-md py-2 px-4">
					<p>hey! this post is hidden! please don't share the link for now...</p>
				</div>
			)}

			<aside className='fixed transform -translate-x-60 opacity-0 xl:opacity-100 transition-opacity'>
				<nav className='flex flex-col gap-8'>
					<a href="/" className='font-mono'>{'../'}</a>
					<TableOfContents headings={headings} />
				</nav>
			</aside>

			<div className='opacity-100 xl:opacity-0 transition-opacity'>
				<Link href="/" className="text-blue-500 dark:text-neutral-400 hover:text-blue-800 dark:hover:text-neutral-600 font-mono">
					../
				</Link>
			</div>

		<main className="prose prose-zinc max-w-none transition-all prose-a:underline dark:prose-a:decoration-neutral-600 dark:hover:prose-a:decoration-neutral-400 prose-a:decoration-neutral-400 hover:prose-a:decoration-neutral-500 prose-a:decoration-1 prose-a:underline-offset-4 prose-code:bg-neutral-200 dark:prose-code:bg-neutral-800 prose-code:p-1 prose-code:rounded-lg prose-code:content-none prose-img:rounded-md prose-img:w-full dark:prose-invert">
				<h1 className='text-md'>{frontMatter.name}</h1>
				<div className='flex flex-col mt-2'>
					<time className='dark:text-neutral-500 p-0 m-0 ' dateTime={new Date(frontMatter.date).toISOString()}>{new Date(frontMatter.date).toDateString()}</time>
					<small className='dark:text-neutral-500 p-0 m-0'>authored by <Link className="underline" passHref href={`/author/${frontMatter.author}`}>{frontMatter.author}</Link></small>
				</div>
				{content}
				<AuthorLinks author={frontMatter.author} />
			</main>
			<footer className="my-8 text-center flex flex-col">
				<span><span className="text-neutral-500">Content on this site is licensed</span> <Link href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</Link></span>
				<span><Link href="/feed.rss">RSS</Link></span>
			</footer>
		</div>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
	const fps = await postFilePaths;
	const paths = fps.map((path) => path.replace(/\.mdx?$/, '').substring(path.lastIndexOf('/') + 1)).map((slug) => ({ params: { slug } }));

	return {
		paths,
		fallback: false,
	};
};