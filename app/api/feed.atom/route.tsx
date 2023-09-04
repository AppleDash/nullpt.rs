import { addPosts, feed } from '../../server/feed';

export const config = {
	runtime: 'nodejs',
};

export async function GET() {
	await addPosts();

	return new Response(feed.atom1(), {
		status: 200,
		headers: {
			'Content-Type': 'text/xml'
		}
	});
}