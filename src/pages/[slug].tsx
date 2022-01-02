import {GetStaticPaths, GetStaticProps, PageConfig} from 'next';
import Link from 'next/link';
import {posts} from '../posts';

export const config: PageConfig = {
	unstable_runtimeJS: false,
};

interface Props {
	slug: string;
}

export default function PostPage({slug}: Props) {
	const post = posts.find(post => post.slug === slug)!;

	return (
		<div className="space-y-4">
			<Link href="../">
				<a className="text-blue-500 dark:text-gray-400 hover:text-blue-800 dark:hover:text-gray-600">
					../
				</a>
			</Link>

			<main className="prose dark:prose-invert prose-a:text-blue-500 prose-a:hover:text-blue-800">
				{post.render()}
			</main>
		</div>
	);
}

export const getStaticProps: GetStaticProps<Props> = async ({params}) => {
	const slug = params!.slug as string;

	const post = posts.find(post => post.slug === slug);

	if (!post) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			slug,
		},
	};
};

export const getStaticPaths: GetStaticPaths = async () => ({
	paths: posts.map(post => ({params: {slug: post.slug}})),
	fallback: 'blocking',
});
